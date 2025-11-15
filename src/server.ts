import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

import productRoutes from "./routes/productRoutes";
import adjustmentRoutes from "./routes/adjustmentRoutes";

dotenv.config();

export async function buildServer() {
  const fastify = Fastify({
    logger: true
  });

  await fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });

  fastify.register(productRoutes, { prefix: "/api/products" });
  fastify.register(adjustmentRoutes, { prefix: "/api/adjustments" });

  return fastify;
}

async function start() {
  const fastify = await buildServer();
  const port = Number(process.env.PORT ?? 4000);

  try {
    await fastify.listen({ port, host: "0.0.0.0" });
    fastify.log.info(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}