import type { FastifyInstance, FastifyPluginOptions } from "fastify";
import db from "../db";

interface ListQuery {
  page?: number;
  limit?: number;
  sku?: string;
}

interface CreateAdjustmentBody {
  product_sku?: string;
  product_id?: number;
  qty?: number;
  amount?: number | null;
}

interface UpdateAdjustmentBody {
  qty?: number;
  amount?: number | null;
}

async function adjustmentRoutes(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  // LIST ADJUSTMENTS
  fastify.get<{ Querystring: ListQuery }>("/", async (request, reply) => {
    const { page: pageRaw, limit: limitRaw, sku } = request.query;

    const page = Number(pageRaw ?? 1);
    const limit = Number(limitRaw ?? 10);
    const offset = (page - 1) * limit;

    const params: any[] = [];
    const conditions: string[] = [];
    let idx = 1;

    if (sku && sku.trim()) {
      params.push(`%${sku.trim().toLowerCase()}%`);
      conditions.push(`LOWER(p.sku) LIKE $${idx++}`);
    }

    const whereSql = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    params.push(limit);
    params.push(offset);
    const limitIdx = idx++;
    const offsetIdx = idx++;

    const rows = await db.manyOrNone(
      `
      SELECT
        a.id,
        a.product_id,
        p.sku,
        p.title,
        a.qty,
        a.amount,
        a.created_at
      FROM adjustments a
      JOIN products p ON p.id = a.product_id
      ${whereSql}
      ORDER BY a.created_at DESC, a.id DESC
      LIMIT $${limitIdx} OFFSET $${offsetIdx}
      `,
      params
    );

    return reply.send({
      data: rows,
      page,
      limit,
    });
  });

  // CREATE ADJUSTMENT
  fastify.post<{ Body: CreateAdjustmentBody }>("/", async (request, reply) => {
    const { product_sku, product_id, qty, amount } = request.body || {};

    if ((!product_sku || !product_sku.trim()) && !product_id) {
      return reply
        .status(400)
        .send({ message: "product_sku or product_id is required" });
    }

    if (qty === undefined || qty === null) {
      return reply.status(400).send({ message: "qty is required" });
    }

    const numericQty = Number(qty);
    if (!Number.isFinite(numericQty) || numericQty === 0) {
      return reply
        .status(400)
        .send({ message: "qty must be a non-zero number" });
    }

    let productRow: any | null = null;
    if (product_id) {
      productRow = await db.oneOrNone(
        `SELECT id, sku, title, price FROM products WHERE id = $1`,
        [product_id]
      );
    } else if (product_sku && product_sku.trim()) {
      productRow = await db.oneOrNone(
        `SELECT id, sku, title, price FROM products WHERE sku = $1`,
        [product_sku.trim()]
      );
    }

    if (!productRow) {
      return reply
        .status(404)
        .send({ message: "Product not found for given identifier" });
    }

    const stockRow = await db.one<{ stock: string | null }>(
      `
      SELECT COALESCE(SUM(qty), 0) AS stock
      FROM adjustments
      WHERE product_id = $1
      `,
      [productRow.id]
    );

    const currentStock = Number(stockRow.stock ?? 0);
    const newStock = currentStock + numericQty;

    if (!Number.isFinite(currentStock)) {
      fastify.log.warn(
        { currentStock: stockRow.stock },
        "Invalid current stock value"
      );
    }

    if (newStock < 0) {
      return reply.status(400).send({
        message: `Failed to create adjustment, insufficient stock. Current stock is ${currentStock}`,
      });
    }

    let numericAmount: number | null = null;
    if (amount !== undefined && amount !== null) {
      numericAmount = Number(amount);
      if (!Number.isFinite(numericAmount)) {
        return reply
          .status(400)
          .send({ message: "amount must be a valid number" });
      }
    } else {
      numericAmount = Number(productRow.price) * numericQty;
    }

    const inserted = await db.one(
      `
      INSERT INTO adjustments (product_id, qty, amount)
      VALUES ($1, $2, $3)
      RETURNING id, product_id, qty, amount, created_at
      `,
      [productRow.id, numericQty, numericAmount]
    );

    return reply.status(201).send({
      id: inserted.id,
      product_id: inserted.product_id,
      sku: productRow.sku,
      title: productRow.title,
      qty: inserted.qty,
      amount: inserted.amount,
      created_at: inserted.created_at,
    });
  });

  // UPDATE ADJUSTMENT
  fastify.put<{ Params: { id: string }; Body: UpdateAdjustmentBody }>(
    "/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "Invalid adjustment id" });
      }

      const { qty, amount } = request.body || {};

      const row = await db.oneOrNone(
        `
      SELECT 
        a.id,
        a.product_id,
        a.qty AS current_qty,
        a.amount AS current_amount,
        p.sku,
        p.title,
        p.price
      FROM adjustments a
      JOIN products p ON p.id = a.product_id
      WHERE a.id = $1
      `,
        [id]
      );

      if (!row) {
        return reply.status(404).send({ message: "Adjustment not found" });
      }

      const currentQty = Number(row.current_qty);
      let newQty = currentQty;

      if (qty !== undefined && qty !== null) {
        const numericQty = Number(qty);
        if (!Number.isFinite(numericQty) || numericQty === 0) {
          return reply
            .status(400)
            .send({ message: "qty must be a non-zero number" });
        }
        newQty = numericQty;
      }

      const stockRow = await db.one<{ stock: string | null }>(
        `
      SELECT COALESCE(SUM(qty), 0) AS stock
      FROM adjustments
      WHERE product_id = $1
        AND id <> $2
      `,
        [row.product_id, id]
      );

      const stockWithoutThis = Number(stockRow.stock ?? 0);
      const newStock = stockWithoutThis + newQty;

      if (newStock < 0) {
        return reply.status(400).send({
          message: `Cannot update adjustment: stock would go negative (current stock without this: ${stockWithoutThis}, proposed qty: ${newQty})`,
        });
      }

      let newAmount: number;
      if (amount !== undefined && amount !== null) {
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount)) {
          return reply
            .status(400)
            .send({ message: "amount must be a valid number" });
        }
        newAmount = numericAmount;
      } else {
        newAmount = Number(row.price) * newQty;
      }

      const updated = await db.one(
        `
      UPDATE adjustments
      SET qty = $1,
          amount = $2
      WHERE id = $3
      RETURNING id, product_id, qty, amount, created_at
      `,
        [newQty, newAmount, id]
      );

      return reply.send({
        id: updated.id,
        product_id: updated.product_id,
        sku: row.sku,
        title: row.title,
        qty: updated.qty,
        amount: updated.amount,
        created_at: updated.created_at,
      });
    }
  );

  // DELETE ADJUSTMENT
  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
      return reply.status(400).send({ message: "Invalid adjustment id" });
    }

    const existing = await db.oneOrNone(
      `
      SELECT id FROM adjustments WHERE id = $1
      `,
      [id]
    );

    if (!existing) {
      return reply.status(404).send({ message: "Adjustment not found" });
    }

    await db.none(`DELETE FROM adjustments WHERE id = $1`, [id]);

    return reply.status(204).send();
  });
}

export default adjustmentRoutes;
