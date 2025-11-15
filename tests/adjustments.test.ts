import type { FastifyInstance } from "fastify";
import { buildServer } from "../src/server";
import { closeDb } from "../src/db";

describe("Adjustments API", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    closeDb();
  });

  it("should reject adjustment that makes stock negative", async () => {
    const sku = `TEST-NEG-STOCK-${Date.now()}`;

    const createRes = await app.inject({
      method: "POST",
      url: "/api/products",
      payload: {
        sku,
        title: "Test Negative Stock Product",
        price: 10,
        description: "Test-only product",
        image_url: null,
        category: "test",
      },
    });

    expect(createRes.statusCode).toBe(201);
    const product = createRes.json() as any;
    expect(product).toHaveProperty("id");

    const adjRes = await app.inject({
      method: "POST",
      url: "/api/adjustments",
      payload: {
        sku,
        qty: -1,
      },
    });

    expect(adjRes.statusCode).toBeGreaterThanOrEqual(400);
    expect(adjRes.statusCode).toBeLessThan(500);

    const body = adjRes.json() as any;
    expect(body).toHaveProperty("message");
  });
});