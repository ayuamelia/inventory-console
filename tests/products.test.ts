import type { FastifyInstance } from "fastify";
import { buildServer } from "../src/server";
import { closeDb } from "../src/db";

describe("Products API", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    closeDb();
  });

  it("GET /api/products should return a list of products", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/products?page=1&limit=5",
    });

    expect(res.statusCode).toBe(200);

    const body = res.json() as any;

    expect(body).toHaveProperty("data");
    expect(Array.isArray(body.data)).toBe(true);
  });
});