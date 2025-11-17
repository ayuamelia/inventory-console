# Inventory Console – Products & Stock Adjustments

This project is an inventory console.

It consists of:

- A **backend API** that imports product data from DummyJSON, persists it in PostgreSQL, and manages products and stock adjustment transactions with strict business rules.
- A **frontend dashboard** that allows users to explore products, manage them, and record stock movements in a way that feels like a real internal tool.

The focus is on **correctness, data consistency, and practical UX** rather than heavy visuals. Some extra touches (theme toggle, dynamic filters, validation) are included to bring it closer to a production-ready tool.

---

## High-level features

### Product management

- Import products from DummyJSON and store them in PostgreSQL (via a dedicated `/api/products/import` endpoint).
- List products with:
  - Pagination
  - Search by SKU or title (case-insensitive, debounced)
  - Sort by:
    - Newest first
    - Title (A → Z / Z → A)
    - Price (low → high / high → low)
    - Stock (low → high / high → low)
  - **Dynamic category filter** – options are built from live data in the DB, not hard coded.
- Product detail modal:
  - View & edit SKU, title, price, description, image URL, category.
  - Live image preview using the product’s image URL.
  - Validation:
    - Price must be numeric.
    - SKU must be unique (handles backend error and shows friendly message).
- Create & delete products:
  - New products can be added from the UI.
  - Deleting a product also deletes all related stock adjustments (via `ON DELETE CASCADE`).

### Adjustment transactions

- Record stock movements per product with **positive or negative quantities**.
- Business rule enforced at the API level:
  - You cannot create or update a transaction that makes stock go below zero.
- Each adjustment stores:
  - Product reference
  - `qty` (positive = stock in, negative = stock out)
  - `amount` computed from product `price * qty`
- Adjustments page:
  - Paginated table with ID, SKU, qty, amount, created at.
  - Color-coded qty:
    - Positive movements vs negative movements.
  - Create / edit / delete adjustment transactions from the UI.
- When a product is deleted, all its adjustments are automatically removed by the database.

### Inventory logic

- Stock is **not** stored as a static column.
- Current stock = sum of all `qty` from adjustments per product.
- Product list endpoint returns stock per product by aggregating adjustments.
- APIs reject any operation (new adjustment or update) that would cause negative stock.

---

## Tech stack

**Backend**

- Node.js + TypeScript
- Fastify (HTTP server)
- PostgreSQL
- pg-promise (database access)
- dotenv (configuration)

**Frontend**

- Next.js 16 (Pages Router)
- React + TypeScript
- Zustand (lightweight state management for products & adjustments)
- Custom CSS (no UI framework), with dark/light theme via CSS variables

---

## Architecture overview

Directory structure (simplified):

```text
.
├── backend
│   ├── src
│   │   ├── db
│   │   │   ├── index.ts
│   │   │   └── migrations
│   │   │       └── init_1.sql
│   │   ├── routes
│   │   │   ├── productRoutes.ts
│   │   │   └── adjustmentRoutes.ts
│   │   └── server.ts
│   └── .env
└── frontend
    ├── src
    │   ├── pages
    │   │   ├── index.tsx
    │   │   ├── products.tsx
    │   │   └── adjustments.tsx
    │   ├── lib
    │   │   └── api.ts
    │   ├── store
    │   │   ├── useProductStore.ts
    │   │   └── useAdjustmentStore.ts
    │   └── components
    │       └── layout
    │           └── Layout.tsx
    └── styles
        └── globals.css
