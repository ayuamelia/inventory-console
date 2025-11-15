# Inventory Backend API

Backend service for the inventory assessment project.  
It imports product data from DummyJSON, persists it in PostgreSQL, and exposes APIs for:

- Managing products
- Managing stock adjustment transactions
- Calculating live stock from adjustments
- Enforcing stock constraints so it never goes negative

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

Stock is **not** stored as a static column.  
Stock is calculated as the sum of all `qty` from `adjustments` for each product.

### Adjustment Transaction

Stored in table `adjustments`:

- `id` (serial, primary key)
- `product_id` (int, foreign key to `products.id`, `ON DELETE CASCADE`)
- `qty` (int, can be positive or negative)
- `amount` (numeric(14,2), value of the movement, usually `price * qty`)
- `created_at` (timestamp, default now)

Business rules:

- `qty` positive means stock in.
- `qty` negative means stock out.
- A new adjustment can never produce a negative stock:
  - `newStock = currentStock + qty`
  - If `newStock < 0` the request is rejected.
- When a product is deleted, all related adjustments are deleted too through `ON DELETE CASCADE`.

---

## API overview

Base URL (development):

```text
http://localhost:4000/api
