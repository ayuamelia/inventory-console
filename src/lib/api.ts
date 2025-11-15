const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

/** ====== Types ====== */
export interface Product {
  id: number;
  sku: string;
  title: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
  stock?: number;
}

export interface Adjustment {
  id: number;
  product_id: number;
  sku: string;
  title?: string;
  qty: number;
  amount: number;
  created_at: string;
}

export type UpdateProductResult =
  | { ok: true; data: Product }
  | { ok: false; message: string };

export type CreateProductResult =
  | { ok: true; data: Product }
  | { ok: false; message: string };

export type ProductListOptions = {
  q?: string;
  sort?: "id" | "sku" | "title" | "price" | "stock" | "created_at";
  dir?: "asc" | "desc";
  category?: string;
};

export interface ProductCategoryOption {
  value: string;
  label: string;
  count: number;
}

export type DeleteProductResult = 
  { ok: true } 
  | { ok: false; message: string };

export type AdjustmentListOptions = {
  sku?: string;
};

export type CreateAdjustmentResult =
  | { ok: true; data: Adjustment }
  | { ok: false; message: string };

export type UpdateAdjustmentResult =
  | { ok: true; data: Adjustment }
  | { ok: false; message: string };

export type DeleteAdjustmentResult =
  | { ok: true }
  | { ok: false; message: string };

/** ====== Products API ====== */
export async function fetchProducts(
  page = 1,
  limit = 8,
  opts: ProductListOptions = {}
): Promise<{ data: Product[]; page: number; limit: number }> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));

  if (opts.q) params.set("q", opts.q);
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.dir) params.set("dir", opts.dir);
  if (opts.category && opts.category !== "all") {
    params.set("category", opts.category);
  }

  const url = `${API_URL}/products?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[fetchProducts] error response:", res.status, text);
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export async function fetchProductDetail(id: number): Promise<Product> {
  const res = await fetch(`${API_URL}/products/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch product detail");
  }
  return res.json();
}

export async function fetchProductCategories(): Promise<ProductCategoryOption[]> {
  const res = await fetch(`${API_URL}/products/categories`);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[fetchProductCategories] error:", res.status, text);
    throw new Error("Failed to fetch product categories");
  }

  const json = await res.json();
  return json.data as ProductCategoryOption[];
}

export async function createProduct(body: {
  sku: string;
  title: string;
  price: number;
  description?: string | null;
  image_url?: string | null;
  category?: string | null;
}): Promise<CreateProductResult> {
  const res = await fetch(`${API_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Failed to create product";

    try {
      const text = await res.text();
      console.error("[createProduct] error response:", res.status, text);
      if (text) {
        const json = JSON.parse(text);
        if (json?.message) {
          message = json.message;
        }
      }
      if (res.status === 409 && !message) {
        message = "Product with this SKU already exists";
      }
    } catch (err) {
      console.error("[createProduct] failed to parse error body", err);
    }

    return { ok: false, message };
  }

  const data = (await res.json()) as Product;
  return { ok: true, data };
}

export async function updateProduct(
  id: number,
  body: Partial<Omit<Product, "id" | "stock">>
): Promise<UpdateProductResult> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorMessage = "Failed to update product";

    try {
      const text = await res.text();
      console.error("[updateProduct] error response:", res.status, text);

      if (text) {
        const json = JSON.parse(text);
        if (json?.message) {
          errorMessage = json.message;
        }
      }

      if (res.status === 409 && !errorMessage) {
        errorMessage = "Product SKU already exists";
      }
    } catch (parseErr) {
      console.error("[updateProduct] failed to parse error body", parseErr);
    }

    return { ok: false, message: errorMessage };
  }

  const data = (await res.json()) as Product;
  return { ok: true, data };
}

export async function deleteProduct(id: number): Promise<DeleteProductResult> {
  const res = await fetch(`${API_URL}/products/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let message = "Failed to delete product";

    try {
      const text = await res.text();
      console.error("[deleteProduct] error response:", res.status, text);
      if (text) {
        const json = JSON.parse(text);
        if (json?.message) {
          message = json.message;
        }
      }
    } catch (err) {
      console.error("[deleteProduct] failed to parse error body", err);
    }

    return { ok: false, message };
  }

  return { ok: true };
}

/** ====== Adjustments API ====== */

export async function fetchAdjustments(
  page = 1,
  limit = 10,
  opts: AdjustmentListOptions = {}
): Promise<{ data: Adjustment[]; page: number; limit: number }> {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (opts.sku) params.set("sku", opts.sku);

  const url = `${API_URL}/adjustments?${params.toString()}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("[fetchAdjustments] error response:", res.status, text);
    throw new Error("Failed to fetch adjustments");
  }

  return res.json();
}

export async function createAdjustment(body: {
  product_sku: string;
  qty: number;
  amount?: number | null;
}): Promise<CreateAdjustmentResult> {
  const res = await fetch(`${API_URL}/adjustments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Failed to create adjustment";

    try {
      const text = await res.text();
      console.error("[createAdjustment] error response:", res.status, text);
      if (text) {
        const json = JSON.parse(text);
        if (json?.message) {
          message = json.message;
        }
      }
    } catch (err) {
      console.error("[createAdjustment] parse error", err);
    }

    return { ok: false, message };
  }

  const data = (await res.json()) as Adjustment;
  return { ok: true, data };
}

export async function updateAdjustment(
  id: number,
  body: { qty?: number; amount?: number | null }
): Promise<UpdateAdjustmentResult> {
  const res = await fetch(`${API_URL}/adjustments/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = "Failed to update adjustment";
    try {
      const text = await res.text();
      console.error("[updateAdjustment] error response:", res.status, text);
      if (text) {
        const json = JSON.parse(text);
        if (json?.message) message = json.message;
      }
    } catch (err) {
      console.error("[updateAdjustment] parse error", err);
    }
    return { ok: false, message };
  }

  const data = (await res.json()) as Adjustment;
  return { ok: true, data };
}

export async function deleteAdjustment(
  id: number
): Promise<DeleteAdjustmentResult> {
  const res = await fetch(`${API_URL}/adjustments/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    let message = "Failed to delete adjustment";
    try {
      const text = await res.text();
      console.error("[deleteAdjustment] error response:", res.status, text);
      if (text) {
        const json = JSON.parse(text);
        if (json?.message) message = json.message;
      }
    } catch (err) {
      console.error("[deleteAdjustment] parse error", err);
    }
    return { ok: false, message };
  }

  return { ok: true };
}
