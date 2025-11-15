import { FastifyInstance, FastifyPluginOptions } from "fastify";
import db from "../db";
import axios from "axios";
import { Product } from "../types/product";

interface ListQuery {
  page?: number;
  limit?: number;
  q?: string;
  sort?: string;
  dir?: string;
  category?: string;
}

export default async function productRoutes(
  fastify: FastifyInstance,
  _opts: FastifyPluginOptions
) {
  // - - - LIST PRODUCTS (with stock) - - -
  fastify.get<{ Querystring: ListQuery }>("/", async (request, reply) => {
    const {
      page: pageRaw,
      limit: limitRaw,
      q,
      sort,
      dir,
      category,
    } = request.query;

    const page = Number(pageRaw ?? 1);
    const limit = Number(limitRaw ?? 8);
    const offset = (page - 1) * limit;

    let idx = 1;
    const params: any[] = [];
    const conditions: string[] = [];

    if (q && q.trim()) {
      const pattern = `%${q.trim().toLowerCase()}%`;
      params.push(pattern);
      conditions.push(
        `(LOWER(p.sku) LIKE $${idx} OR LOWER(p.title) LIKE $${idx})`
      );
      idx++;
    }

    if (category && category !== "all") {
      params.push(category.toLowerCase());
      conditions.push(`LOWER(p.category) = $${idx}`);
      idx++;
    }

    const whereSql = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const sortColumns: Record<string, string> = {
      id: "p.id",
      sku: "p.sku",
      title: "p.title",
      price: "p.price",
      created_at: "p.created_at",
      stock: "stock",
    };

    const sortKey = sort && sortColumns[sort] ? sort : "id";
    const sortColumn = sortColumns[sortKey];
    const sortDir = dir && dir.toLowerCase() === "asc" ? "ASC" : "DESC";

    const limitParamIndex = idx;
    const offsetParamIndex = idx + 1;

    params.push(limit);
    params.push(offset);

    const rows = await db.manyOrNone(
      `
      SELECT
        p.id,
        p.sku,
        p.title,
        p.price,
        p.description,
        p.image_url,
        p.category,
        p.created_at,
        p.updated_at,
        COALESCE(SUM(a.qty), 0) AS stock
      FROM products p
      LEFT JOIN adjustments a ON a.product_id = p.id
      ${whereSql}
      GROUP BY p.id
      ORDER BY ${sortColumn} ${sortDir}
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}
    `,
      params
    );

    return reply.send({
      data: rows,
      page,
      limit,
    });
  });

  // - - - LIST PRODUCT CATEGORIES - - -
  fastify.get("/categories", async (request, reply) => {
    const rows = await db.manyOrNone<{
      value: string;
      label: string;
      count: string;
    }>(
      `
    SELECT
      LOWER(category) AS value,
      MIN(category) AS label,
      COUNT(*)::text AS count
    FROM products
    WHERE category IS NOT NULL AND category <> ''
    GROUP BY LOWER(category)
    ORDER BY MIN(category)
    `
    );

    const categories = rows.map((r) => ({
      value: r.value,
      label: r.label,
      count: Number(r.count),
    }));

    return reply.send({ data: categories });
  });

  // - - - GET DETAIL PRODUCT - - -
  fastify.get<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
      return reply.status(400).send({ message: "Invalid product id" });
    }

    const row = await db.oneOrNone(
      `
      SELECT
        p.*,
        COALESCE(SUM(a.qty), 0) AS stock
      FROM products p
      LEFT JOIN adjustments a ON a.product_id = p.id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [id]
    );

    if (!row) {
      return reply.code(404).send({ message: "Product not found" });
    }

    reply.send(row);
  });

  // - - - CREATE PRODUCT - - -
  fastify.post<{ Body: Omit<Product, "id"> }>("/", async (request, reply) => {
    const { sku, title, price, description, image_url, category } = request.body;
    if (!sku || !title) {
      return reply.status(400).send({ message: "sku and title are required" });
    }

    const numericPrice = typeof price === "number" ? price : Number(price ?? 0);

    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      return reply
        .status(400)
        .send({ message: "price must be a non negative number" });
    }

    try {
      const created = await db.one(
        `
        INSERT INTO products (sku, title, price, description, image_url, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
          id,
          sku,
          title,
          price,
          description,
          image_url,
          category,
          created_at,
          updated_at
        `,
        [sku, title, numericPrice, description ?? null, image_url ?? null, category ?? null]
      );

      return reply.status(201).send(created);
    } catch (err: any) {
      // unique violation for sku
      if (err.code === "23505") {
        return reply
          .status(409)
          .send({ message: "Product with this sku already exists" });
      }

      fastify.log.error(err);
      return reply.status(500).send({ message: "Failed to create product" });
    }
  });

  // - - - UPDATE PRODUCT (partial) - - -
  fastify.put<{ Params: { id: string }; Body: Partial<Product> }>(
    "/:id",
    async (request, reply) => {
      const id = Number(request.params.id);
      const { title, price, description, image_url, category } = request.body;
      if (Number.isNaN(id)) {
        return reply.status(400).send({ message: "Invalid product id" });
      }

      const body = request.body || {};
      const fields: string[] = [];
      const values: any[] = [];
      let idx = 1;

      if (body.sku !== undefined) {
        fields.push(`sku = $${idx++}`);
        values.push(body.sku);
      }
      if (body.title !== undefined) {
        fields.push(`title = $${idx++}`);
        values.push(body.title);
      }
      if (body.price !== undefined) {
        const numericPrice =
          typeof body.price === "number" ? body.price : Number(body.price ?? 0);
        if (Number.isNaN(numericPrice) || numericPrice < 0) {
          return reply
            .status(400)
            .send({ message: "price must be a non negative number" });
        }
        fields.push(`price = $${idx++}`);
        values.push(numericPrice);
      }
      if (body.description !== undefined) {
        fields.push(`description = $${idx++}`);
        values.push(body.description ?? null);
      }
      if (body.image_url !== undefined) {
        fields.push(`image_url = $${idx++}`);
        values.push(body.image_url ?? null);
      }
      if (body.category !== undefined) {
        fields.push(`category = $${idx++}`);
        values.push(body.category ?? null);
      }

      if (fields.length === 0) {
        const existing = await db.oneOrNone(
          `
          SELECT
            id, sku, title, price, description, image_url, category, created_at, updated_at
          FROM products
          WHERE id = $1
          `,
          [id]
        );
        if (!existing) {
          return reply.status(404).send({ message: "Product not found" });
        }
        return reply.send(existing);
      }

      fields.push(`updated_at = NOW()`);
      values.push(id);

      try {
        const updated = await db.oneOrNone(
          `
          UPDATE products
          SET ${fields.join(", ")}
          WHERE id = $${idx}
          RETURNING
            id,
            sku,
            title,
            price,
            description,
            image_url,
            category,
            created_at,
            updated_at
          `,
          values
        );

        if (!updated) {
          return reply.status(404).send({ message: "Product not found" });
        }

        return reply.send(updated);
      } catch (err: any) {
        if (err.code === "23505") {
          return reply
            .status(409)
            .send({ message: "Product with this sku already exists" });
        }
        fastify.log.error(err);
        return reply.status(500).send({ message: "Failed to update product" });
      }
    }
  );

  // - - - DELETE PRODUCT - - -
  fastify.delete<{ Params: { id: string } }>("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
      return reply.status(400).send({ message: "Invalid product id" });
    }
    const result = await db.result(`DELETE FROM products WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      return reply.status(404).send({ message: "Product not found" });
    }

    return reply.status(204).send();
  });

  // - - - IMPORT PRODUCTS FROM DUMMYJSON - - -
  fastify.post<{ Body: { limit: number } }>(
    "/import",
    async (request, reply) => {
      const baseUrl = process.env.DUMMYJSON_BASE_URL || "https://dummyjson.com";

      const resp = await axios.get(
        `${baseUrl}/products?limit=${request.body.limit}`
      );
      const items = resp.data.products as any[];

      const queries = items.map((p) => {
        return db.none(
          `
        INSERT INTO products (sku, title, price, description, image_url, category)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (sku) DO NOTHING
        `,
          [
            String(p.id),
            p.title,
            p.price,
            p.description ?? null,
            Array.isArray(p.images) && p.images.length > 0
              ? p.images[0]
              : p.thumbnail ?? null,
            p.category ?? null,
          ]
        );
      });

      await db.tx((t) => t.batch(queries));

      reply.send({ imported: items.length });
    }
  );
}
