"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Layout from "../components/layout/Layout";
import { useProductStore } from "../store/useProductStore";
import {
  fetchProducts,
  fetchProductDetail,
  updateProduct,
  createProduct,
  deleteProduct,
  type Product,
  ProductListOptions,
  fetchProductCategories,
  type ProductCategoryOption,
} from "../lib/api";

const LIMIT = 8;

type ProductFormState = {
  sku: string;
  title: string;
  price: string;
  description: string;
  image_url: string;
  category: string | null;
};

type SortKey =
  | "recent"
  | "title_az"
  | "title_za"
  | "price_low"
  | "price_high"
  | "stock_low"
  | "stock_high";

export default function ProductsPage() {

  const { items, page, hasMore, appendPage, reset, updateItem, addItem, removeItem } = useProductStore();
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"create" | "edit">("edit");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("recent");

  const [category, setCategory] = useState<string>("all");
  const [categoryOptions, setCategoryOptions] = useState<ProductCategoryOption[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalSaving, setModalSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormState | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 400);

    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    async function init() {
      reset();
      setLoading(true);

      const { sort, dir } = mapSort(sortKey);

      try {
        const res = await fetchProducts(1, LIMIT, {
          q: search || undefined,
          sort,
          dir,
          category,
        });
        appendPage(res.data, 1, LIMIT);
      } catch (e) {
        console.error("[ProductsPage] error initial load", e);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, [reset, appendPage, search, sortKey, category]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    const nextPage = page + 1;
    setLoading(true);

    const { sort, dir } = mapSort(sortKey);

    try {
      const res = await fetchProducts(nextPage, LIMIT, {
        q: search || undefined,
        sort,
        dir,
        category,
      });
      appendPage(res.data, nextPage, LIMIT);
    } catch (e) {
      console.error("[ProductsPage] error loadMore", e);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, appendPage, sortKey, search, category]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        console.log("[ProductsPage] observer intersecting");
        loadMore();
      }
    });

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadMore]);

  console.log("[ProductsPage] render", {
    itemsLength: items.length,
    page,
    hasMore,
    loading,
  });

  useEffect(() => {
    async function loadCategories() {
      setCategoryLoading(true);
      setCategoryError(null);
      try {
        const data = await fetchProductCategories();
        setCategoryOptions(data);
      } catch (err) {
        console.error("[ProductsPage] loadCategories error", err);
        setCategoryError("Failed to load categories");
      } finally {
        setCategoryLoading(false);
      }
    }

    loadCategories();
  }, []);
  function handleOpenCreate() {
    setMode("create");
    setModalError(null);
    setEditingId(null);
    setForm({
      sku: "",
      title: "",
      price: "0",
      description: "",
      image_url: "",
      category: "",
    });
    setModalOpen(true);
  }

  async function handleOpenDetail(id: number) {
    setMode("edit");
    setModalError(null);
    setModalOpen(true);
    setModalLoading(true);
    setEditingId(id);

    try {
      const detail = await fetchProductDetail(id);
      setForm({
        sku: detail.sku,
        title: detail.title,
        price: String(detail.price ?? 0),
        description: detail.description ?? "",
        image_url: detail.image_url ?? "",
        category: detail.category ?? null,
      });
    } catch (e) {
      console.error("[ProductsPage] error fetching detail", e);
      setModalError("Failed to load product detail");
    } finally {
      setModalLoading(false);
    }
  }
  function handleCloseModal() {
    if (modalSaving) return;
    setModalOpen(false);
    setEditingId(null);
    setForm(null);
    setModalError(null);
  }

  function handleFormChange<K extends keyof ProductFormState>(
    field: K,
    value: ProductFormState[K]
  ) {
    setForm((prev) =>
      prev
        ? {
          ...prev,
          [field]: value,
        }
        : prev
    );
  }

  async function handleSave() {
    if (!form) return;

    setModalError(null);

    if (!form.sku.trim() || !form.title.trim()) {
      setModalError("SKU and title are required");
      return;
    }

    const numericPrice = Number(
      form.price.replace(/[^\d.,]/g, "").replace(",", ".")
    );
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      setModalError("Price must be a non negative number");
      return;
    }

    setModalSaving(true);

    try {
      if (mode === "create") {
        const result = await createProduct({
          sku: form.sku.trim(),
          title: form.title.trim(),
          price: numericPrice,
          description: form.description.trim() || null,
          image_url: form.image_url.trim() || null,
          category: form.category?.trim() || null,
        });

        if (!result.ok) {
          setModalError(result.message);
          return;
        }

        addItem(result.data);
        handleCloseModal();
      } else {
        if (!editingId) return;

        const result = await updateProduct(editingId, {
          sku: form.sku.trim(),
          title: form.title.trim(),
          price: numericPrice,
          description: form.description.trim() || null,
          image_url: form.image_url.trim() || null,
          category: form.category?.trim() || null,
        });

        if (!result.ok) {
          setModalError(result.message);
          return;
        }

        updateItem(result.data);
        handleCloseModal();
      }
    } catch (e) {
      console.error("[ProductsPage] unexpected error saving product", e);
      setModalError("Unexpected error while saving");
    } finally {
      setModalSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingId || mode !== "edit") return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This action cannot be undone."
    );
    if (!confirmed) return;

    setModalError(null);
    setModalSaving(true);

    try {
      const result = await deleteProduct(editingId);
      if (!result.ok) {
        setModalError(result.message);
        return;
      }

      removeItem(editingId);
      handleCloseModal();
    } catch (e) {
      console.error("[ProductsPage] unexpected error deleting product", e);
      setModalError("Unexpected error while deleting");
    } finally {
      setModalSaving(false);
    }
  }

  function mapSort(key: SortKey): { sort?: ProductListOptions["sort"]; dir?: "asc" | "desc" } {
    switch (key) {
      case "title_az":
        return { sort: "title", dir: "asc" };
      case "title_za":
        return { sort: "title", dir: "desc" };
      case "price_low":
        return { sort: "price", dir: "asc" };
      case "price_high":
        return { sort: "price", dir: "desc" };
      case "stock_low":
        return { sort: "stock", dir: "asc" };
      case "stock_high":
        return { sort: "stock", dir: "desc" };
      case "recent":
      default:
        return { sort: "created_at", dir: "desc" };
    }
  }

  return (
    <Layout>
      <div className="surface">
        <div className="surface-header">
          <div className="surface-title">
            <h1>Products</h1>
            <p>
              Overview of imported products with current stock calculated from
              adjustments.
            </p>
          </div>

          <div className="toolbar">
            <input
              className="input"
              placeholder="Search by SKU or name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">
                {categoryLoading
                  ? "Loading categories..."
                  : "All categories"}
              </option>
              {categoryError && (
                <option value="__error" disabled>
                  {categoryError}
                </option>
              )}
              {categoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.count})
                </option>
              ))}
            </select>

            <select
              className="input"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="recent">Newest first</option>
              <option value="title_az">Title A → Z</option>
              <option value="title_za">Title Z → A</option>
              <option value="price_low">Price low → high</option>
              <option value="price_high">Price high → low</option>
              <option value="stock_low">Stock low → high</option>
              <option value="stock_high">Stock high → low</option>
            </select>

            <div className="chip">
              Page <strong>{page}</strong>
            </div>
            <div className="chip">
              Items <strong>{items.length}</strong>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleOpenCreate}
            >
              Add product
            </button>
          </div>
        </div>

        <div className="products-grid">
          {items.map((p) => {
            const stock = p.stock ?? 0;
            const stockClass =
              stock <= 3 ? "product-stock-badge product-stock-low" : "product-stock-badge product-stock-ok";

            return (
              <article key={p.id} className="product-card">
                {/* Image */}
                <div className="product-image-wrapper">
                  {p.image_url ? (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="product-image"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="product-image-placeholder">
                      No image
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="product-card-header">
                  <span className="product-sku">{p.sku}</span>
                  <span className={stockClass}>Stock {stock}</span>
                </div>

                <div className="product-title">{p.title}</div>

                <div className="product-price">
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 2,
                  }).format(p.price ?? 0)}
                </div>

                <div className="product-footer">
                  <span className="product-meta">ID: {p.id}</span>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => handleOpenDetail(p.id)}
                  >
                    Details
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div
          ref={loaderRef}
          className="h-10 flex items-center justify-center"
          style={{
            marginTop: "0.75rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.8rem",
            color: "#9ca3af",
          }}
        >
          {loading && <span>Loading more…</span>}
          {!loading && !hasMore && <span>No more products</span>}
        </div>
      </div>
      {modalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <div className="modal-title">
                  {mode === "create" ? "Add product" : "Product detail"}
                </div>
                {mode === "edit" && editingId && (
                  <div className="modal-subtitle">ID: {editingId}</div>
                )}
              </div>
              <button
                className="modal-close-btn"
                type="button"
                onClick={handleCloseModal}
                disabled={modalSaving}
              >
                ×
              </button>
            </div>

            {modalError && <div className="modal-error">{modalError}</div>}

            {modalLoading || !form ? (
              <div style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                Loading...
              </div>
            ) : (
              <div className="modal-body">
                <div className="modal-field">
                  <label className="modal-label">Image preview</label>
                  <div className="product-image-preview">
                    {form.image_url ? (
                      <img
                        src={form.image_url}
                        alt={form.title || "Product image"}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const parent = e.currentTarget.parentElement;
                          if (parent) {
                            parent.classList.add("product-image-preview--empty");
                            parent.innerHTML = "<span>No image</span>";
                          }
                        }}
                      />
                    ) : (
                      <span>No image</span>
                    )}
                  </div>
                </div>

                <div className="modal-field">
                  <label className="modal-label">SKU</label>
                  <input
                    className="modal-input"
                    value={form.sku}
                    onChange={(e) => handleFormChange("sku", e.target.value)}
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Title</label>
                  <input
                    className="modal-input"
                    value={form.title}
                    onChange={(e) =>
                      handleFormChange("title", e.target.value)
                    }
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Price</label>
                  <input
                    className="modal-input"
                    inputMode="decimal"
                    pattern="^\d*([.,]\d{0,2})?$"
                    value={form.price}
                    onChange={(e) => {
                      const raw = e.target.value;

                      if (raw === "") {
                        handleFormChange("price", "");
                        return;
                      }

                      const normalized = raw.replace(",", ".");

                      const isValid = /^\d*\.?\d{0,2}$/.test(normalized);

                      if (isValid) {
                        handleFormChange("price", raw);
                      }
                    }}
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Category</label>
                  <input
                    className="modal-input"
                    inputMode="numeric"
                    value={form.category || ""}
                    onChange={(e) =>
                      handleFormChange("category", e.target.value)
                    }
                    placeholder="Optional"
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Description</label>
                  <textarea
                    className="modal-textarea"
                    value={form.description}
                    onChange={(e) =>
                      handleFormChange("description", e.target.value)
                    }
                    placeholder="Optional"
                  />
                </div>

                <div className="modal-field">
                  <label className="modal-label">Image URL</label>
                  <input
                    className="modal-input"
                    value={form.image_url}
                    onChange={(e) =>
                      handleFormChange("image_url", e.target.value)
                    }
                    placeholder="Optional"
                  />
                </div>
              </div>
            )}

            <div className="modal-footer">
              <div>
                {modalSaving && (
                  <span style={{ color: "#9ca3af" }}>
                    {mode === "create" ? "Creating…" : "Saving…"}
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                {mode === "edit" && editingId && (
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={handleDelete}
                    disabled={modalSaving}
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={handleCloseModal}
                  disabled={modalSaving}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={modalSaving || modalLoading || !form}
                >
                  {mode === "create" ? "Create product" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}