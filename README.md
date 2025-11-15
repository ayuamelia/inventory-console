# Inventory Frontend (Next.js)

Frontend web application that consumes the Inventory Backend API and provides:

- Product exploration with search, sort, filter, and infinite scroll
- Product CRUD with inline detail modal
- Stock adjustment transaction management
- Dark / light theme with persistence and responsive layout

---

## Tech stack

- Next.js 16 (Pages Router, dev mode with `next dev`)
- React
- TypeScript
- Zustand (state management for products and adjustments)
- CSS (custom design, no UI framework)
- Fetch API

---

## Pages and features

### `/products` (default page)

Product catalog and inventory overview.

Features:

- **List products** in a responsive grid (mobile, tablet, desktop).
- **Infinite scroll** using IntersectionObserver.
- **Search** by SKU or title (debounced, case insensitive).
- **Sorting**:
  - Newest first
  - Title A to Z
  - Title Z to A
  - Price low to high
  - Price high to low
  - Stock low to high
  - Stock high to low
- **Category filter**:
  - Driven dynamically from backend: `/api/products/categories`
  - `All categories` plus all categories present in the database.
- **Low stock visual cues**:
  - Stock badges with two states (OK vs low) using semantic colors.
- **Product detail modal**:
  - View and edit product fields (title, price, description, image URL, category).
  - Inline image preview for product thumbnail.
  - Client side validation for numeric price.
  - Friendly error handling when backend rejects updates (for example duplicate SKU).
- **Create and delete**:
  - Add new product.
  - Delete product. After deletion, related adjustments are removed by the backend.

URL example:

```text
http://localhost:3000/products
