# Inventory Console - Backend API

Backend service for the inventory assessment project.  
It imports product data from DummyJSON, persists it in PostgreSQL, and exposes APIs for:

- Managing products  
- Managing stock adjustment transactions  
- Calculating live stock from adjustments  
- Enforcing stock constraints so stock never goes negative  

---

## Requirements

- Node.js (LTS)  
- Yarn  
- PostgreSQL running locally or accessible through network  

Example local database connection:

postgres://postgres:admin@localhost:5432/postgres

---

## Quick start

From the `backend` directory:

```bash
# 1. Install dependencies
yarn install

# 2. Configure environment (see section "Configuration")
#    Create .env in the backend folder

# 3. Run database migrations

# Option A: using the package.json script
yarn migrate

# Option B: using psql directly
# psql "$DATABASE_URL" -f src/db/migrations/init_1.sql

# 4. Start the API in development mode
yarn dev
```

By default the API will be available at:

```text
http://localhost:4000/api
```

---

## Configuration

Create a `.env` file in the `backend` directory:

```env
DATABASE_URL=postgres://postgres:admin@localhost:5432/postgres
PORT=4000
DUMMYJSON_BASE_URL=https://dummyjson.com
```

Explanation:

- `DATABASE_URL` : PostgreSQL connection string  
- `PORT` : Port where the Fastify server listens  
- `DUMMYJSON_BASE_URL` : Base URL for DummyJSON product API  

---

## Database setup

Schema is created through SQL migration files in `src/db/migrations`.

Minimal migration example (`init_1.sql`):

```sql
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  description TEXT NULL,
  image_url TEXT NULL,
  category VARCHAR(100),
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS adjustments (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty INTEGER NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);
```

Run migrations using `psql` (from the `backend` folder):

```bash
psql "$DATABASE_URL" -f src/db/migrations/init_1.sql
```

You can also execute the same SQL using any PostgreSQL client GUI.

The API expects the `products` table to contain data.  
During development, products are usually imported from DummyJSON and mapped to this schema.

---

## Seeding data from DummyJSON

To quickly populate the `products` table with realistic data, the API exposes an import endpoint that fetches products from DummyJSON and inserts them into PostgreSQL.

With the products routes registered under `/api/products`, the final endpoint is:

```text
POST /api/products/import
```

Example implementation:

```ts
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
```

To import sample data after the API is running:

```bash
curl -X POST http://localhost:4000/api/products/import   -H "Content-Type: application/json"   -d '{"limit": 50}'
```

This will fetch up to `50` products from DummyJSON, insert them into `products`, ignore duplicates by SKU, and return:

```json
{
  "imported": 50
}
```

---

## Tech stack

- Node.js + TypeScript  
- Fastify (HTTP server)  
- PostgreSQL  
- pg-promise (database access)  
- dotenv (configuration)  

---

## Domain model

### Product

Stored in table `products`:

- `id` (serial, primary key)  
- `sku` (string, unique, required)  
- `title` (string, required)  
- `price` (numeric(12,2), required)  
- `description` (text, optional)  
- `image_url` (text, optional)  
- `category` (string, optional, imported from DummyJSON)  
- `created_at` (timestamp, default now)  
- `updated_at` (timestamp, default now)  

Stock is calculated from related adjustment transactions and is not stored as a static column.  
Current stock for a product is the sum of all `qty` in `adjustments` for that product.

### Adjustment Transaction

Stored in table `adjustments`:

- `id` (serial, primary key)  
- `product_id` (int, foreign key to `products.id`, `ON DELETE CASCADE`)  
- `qty` (int, can be positive or negative)  
- `amount` (numeric(14,2), value of the movement, usually `price * qty`)  
- `created_at` (timestamp, default now)  

Business rules:

- `qty` positive means stock in  
- `qty` negative means stock out  
- A new adjustment can never produce a negative stock:
  - `newStock = currentStock + qty`  
  - If `newStock < 0` the request is rejected with a validation error  
- When a product is deleted, all related adjustments are deleted through `ON DELETE CASCADE`  

---

## API overview

Base URL in development:

```text
http://localhost:4000/api
```

## API documentation (OpenAPI)

This service includes an OpenAPI 3.0 specification covering all public endpoints.
(e.g. products and adjustments).

- File: `backend/api-spec-1.0.yaml`

You can open it with any OpenAPI-compatible viewer (Swagger UI, Redoc, VS Code
OpenAPI extension) to inspect request/response models and try out the endpoints.

### Products

Typical endpoints:

- `GET /api/products`  
  - Query parameters:
    - `page` : number, default 1  
    - `limit` : number  
    - `q` : search text for SKU or title  
    - `sort` : one of `id`, `sku`, `title`, `price`, `stock`, `created_at`  
    - `dir` : `asc` or `desc`  
    - `category` : optional category filter  
- `GET /api/products/categories`  
  - Returns distinct categories derived from existing products, with count per category  
- `GET /api/products/:id`  
  - Returns product detail including computed stock  
- `POST /api/products`  
  - Creates a new product  
  - Validates unique SKU and numeric price  
- `POST /api/products/import`  
  - Imports products from DummyJSON into the `products` table using a `limit` parameter  
  - Ignores existing SKUs using `ON CONFLICT (sku) DO NOTHING`  
- `PUT /api/products/:id`  
  - Updates an existing product  
  - Rejects duplicate SKU and returns clear error message  
- `DELETE /api/products/:id`  
  - Deletes a product and its related adjustments  

### Adjustments

Typical endpoints:

- `GET /api/adjustments`  
  - Paginated list of adjustment transactions for all products (10 transactions per page by design)  
  - Supports optional filter by SKU  
- `POST /api/adjustments`  
  - Creates a new adjustment by SKU or product id  
  - Validates that resulting stock is not negative  
  - Computes `amount` from product price and `qty`  
- `PUT /api/adjustments/:id`  
  - Updates an existing adjustment and revalidates stock  
- `DELETE /api/adjustments/:id`  
  - Deletes an adjustment entry  

These endpoints are used by the frontend to:

- Display a live product catalog with current stock  
- Perform product CRUD operations  
- Record and manage stock movements while keeping inventory consistent  

---

## Tests

Run unit tests for the API:

```bash
yarn test
```

The test suite currently covers:

- A smoke test for `GET /api/products` to ensure the products endpoint is reachable and returns a list.  
- A business rule test that verifies adjustment transactions are rejected when they would make stock negative.
