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
psql "$DATABASE_URL" -f src/db/migrations/init_1.sql

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
During development, products are imported from DummyJSON and mapped to this schema.

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
- `PUT /api/products/:id`  
  - Updates an existing product  
  - Rejects duplicate SKU and returns clear error message  
- `DELETE /api/products/:id`  
  - Deletes a product and its related adjustments  

### Adjustments

Typical endpoints:

- `GET /api/adjustments`  
  - Paginated list of adjustment transactions for all products  
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
