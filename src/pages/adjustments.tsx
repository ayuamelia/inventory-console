import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAdjustmentStore } from "../store/useAdjustmentStore";
import {
  fetchAdjustments,
  createAdjustment,
  updateAdjustment,
  deleteAdjustment,
  type Adjustment,
} from "../lib/api";

const LIMIT = 10;

export default function AdjustmentsPage() {
  const { items, page, hasMore, setPage, setData, reset, prepend, updateItem, removeItem } = useAdjustmentStore();
  const [loading, setLoading] = useState(false);
  const [skuInput, setSkuInput] = useState("");
  const [qtyInput, setQtyInput] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [filterSku, setFilterSku] = useState("");
  const [filterSkuInput, setFilterSkuInput] = useState("");

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editFormError, setEditFormError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQty, setEditQty] = useState("");
  const [editAmount, setEditAmount] = useState("");

  async function loadPage(targetPage: number, opts?: { keepItems?: boolean }) {
    if (loading) return;
    setLoading(true);
    setFormError(null);

    try {
      const res = await fetchAdjustments(targetPage, LIMIT, {
        sku: filterSku || undefined,
      });
      setData(res.data, res.data.length === LIMIT);
      setPage(targetPage);
    } catch (e) {
      console.error("[AdjustmentsPage] loadPage error", e);
      setFormError("Failed to load adjustments");
      if (!opts?.keepItems) {
        setData([], false);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    reset();
    loadPage(1);
  }, [reset]);

  useEffect(() => {
    const handle = setTimeout(() => {
      setFilterSku(filterSkuInput.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [filterSkuInput]);

  useEffect(() => {
    reset();
    loadPage(1);
  }, [filterSku]);

  async function handleSubmitAdjustment(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const sku = skuInput.trim();
    if (!sku) {
      setFormError("Product SKU is required");
      return;
    }

    const qtyNum = Number(qtyInput);
    if (!Number.isFinite(qtyNum) || qtyNum === 0) {
      setFormError("Qty must be a non-zero number");
      return;
    }

    let amountNum: number | null = null;
    if (amountInput.trim() !== "") {
      const normalized = amountInput.replace(",", ".");
      amountNum = Number(normalized);
      if (!Number.isFinite(amountNum)) {
        setFormError("Amount must be a valid number");
        return;
      }
    }

    setFormSubmitting(true);

    try {
      const result = await createAdjustment({
        product_sku: sku,
        qty: qtyNum,
        amount: amountNum ?? undefined,
      });

      if (!result.ok) {
        setFormError(result.message);
        return;
      }

      prepend(result.data);

      setSkuInput("");
      setQtyInput("");
      setAmountInput("");
    } catch (err) {
      console.error("[AdjustmentsPage] unexpected submit error", err);
      setFormError("Unexpected error while creating adjustment");
    } finally {
      setFormSubmitting(false);
    }
  }

  function handleOpenEdit(adj: Adjustment) {
    setEditingId(adj.id);
    setEditQty(String(adj.qty));
    setEditAmount(adj.amount != null ? String(adj.amount) : "");
    setEditFormError(null);
    setEditModalOpen(true);
  }

  function handleCloseEdit() {
    if (editSubmitting) return;
    setEditModalOpen(false);
    setEditingId(null);
    setEditFormError(null);
    setEditQty("");
    setEditAmount("");
  }

  async function handleSaveEdit() {
    if (!editingId) return;
    setEditFormError(null);

    const qtyNum = Number(editQty);
    if (!Number.isFinite(qtyNum) || qtyNum === 0) {
      setEditFormError("Qty must be a non-zero number");
      return;
    }

    let amountNum: number | null = null;
    if (editAmount.trim() !== "") {
      const norm = editAmount.replace(",", ".");
      amountNum = Number(norm);
      if (!Number.isFinite(amountNum)) {
        setEditFormError("Amount must be a valid number");
        return;
      }
    }

    setEditSubmitting(true);

    try {
      const result = await updateAdjustment(editingId, {
        qty: qtyNum,
        amount: amountNum ?? undefined,
      });

      if (!result.ok) {
        setEditFormError(result.message);
        return;
      }

      updateItem(result.data);
      handleCloseEdit();
    } catch (err) {
      console.error("[AdjustmentsPage] unexpected edit error", err);
      setEditFormError("Unexpected error while saving");
    } finally {
      setEditSubmitting(false);
    }
  }

  async function handleDeleteEdit() {
    if (!editingId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this adjustment?"
    );
    if (!confirmed) return;

    setEditFormError(null);
    setEditSubmitting(true);

    try {
      const result = await deleteAdjustment(editingId);
      if (!result.ok) {
        setEditFormError(result.message);
        return;
      }

      removeItem(editingId);
      handleCloseEdit();
    } catch (err) {
      console.error("[AdjustmentsPage] unexpected delete error", err);
      setEditFormError("Unexpected error while deleting");
    } finally {
      setEditSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="surface">
        <div className="surface-header">
          <div className="surface-title">
            <h1>Stock Adjustments</h1>
            <p>Transaction history of stock movements per product.</p>
          </div>

          <div className="toolbar">
            <input
              className="input toolbar-input"
              placeholder="Filter by SKU…"
              value={filterSkuInput}
              onChange={(e) => setFilterSkuInput(e.target.value)}
            />
            <div className="chip">
              Page <strong>{page}</strong>
            </div>
            <div className="chip">
              Rows <strong>{items.length}</strong>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmitAdjustment}
          className="adjustment-form"
        >
          <div className="modal-field">
            <label className="modal-label">Product SKU</label>
            <input
              className="modal-input"
              value={skuInput}
              onChange={(e) => setSkuInput(e.target.value)}
              placeholder="e.g. 1, 2, or dummy SKU"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Qty (+ / -)</label>
            <input
              className="modal-input"
              inputMode="numeric"
              value={qtyInput}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "" || /^-?\d*$/.test(raw)) {
                  setQtyInput(raw);
                }
              }}
              placeholder="e.g. 5 or -3"
            />
          </div>

          <div className="modal-field">
            <label className="modal-label">Amount (USD)</label>
            <input
              className="modal-input"
              inputMode="decimal"
              value={amountInput}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === "") {
                  setAmountInput("");
                  return;
                }
                const normalized = raw.replace(",", ".");
                if (/^-?\d*\.?\d{0,2}$/.test(normalized)) {
                  setAmountInput(raw);
                }
              }}
              placeholder="Optional, auto = price * qty"
            />
          </div>

          <div style={{ alignSelf: "flex-end", paddingBottom: "0.1rem" }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={formSubmitting}
            >
              {formSubmitting ? "Saving…" : "Add"}
            </button>
          </div>
        </form>

        {formError && (
          <div className="modal-error" style={{ marginBottom: "0.5rem" }}>
            {formError}
          </div>
        )}

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>SKU</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount (USD)</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((a: Adjustment) => {
                const isPositive = a.qty > 0;
                const badgeClass = isPositive
                  ? "badge badge-green"
                  : "badge badge-red";
                const sign = isPositive ? "+" : "";

                return (
                  <tr key={a.id}>
                    <td>{a.id}</td>
                    <td>{a.sku}</td>
                    <td>{a.title}</td>
                    <td>
                      <span className={badgeClass}>
                        {sign}
                        {a.qty}
                      </span>
                    </td>
                    <td>
                      {Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 2,
                      }).format(a.amount ?? 0)}
                    </td>
                    <td>{new Date(a.created_at).toLocaleString("id-ID")}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => handleOpenEdit(a)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
              {editModalOpen && (
                <div className="modal-backdrop" onClick={handleCloseEdit}>
                  <div
                    className="modal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="modal-header">
                      <div>
                        <div className="modal-title">Edit adjustment</div>
                        {editingId && (
                          <div className="modal-subtitle">ID: {editingId}</div>
                        )}
                      </div>
                      <button
                        className="modal-close-btn"
                        type="button"
                        onClick={handleCloseEdit}
                        disabled={editSubmitting}
                      >
                        ×
                      </button>
                    </div>

                    {editFormError && (
                      <div className="modal-error">{editFormError}</div>
                    )}

                    <div className="modal-body">
                      <div className="modal-field">
                        <label className="modal-label">Qty (+/-)</label>
                        <input
                          className="modal-input"
                          inputMode="numeric"
                          value={editQty}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "" || /^-?\d*$/.test(raw)) {
                              setEditQty(raw);
                            }
                          }}
                        />
                      </div>

                      <div className="modal-field">
                        <label className="modal-label">Amount (USD)</label>
                        <input
                          className="modal-input"
                          inputMode="decimal"
                          value={editAmount}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              setEditAmount("");
                              return;
                            }
                            const norm = raw.replace(",", ".");
                            if (/^-?\d*\.?\d{0,2}$/.test(norm)) {
                              setEditAmount(raw);
                            }
                          }}
                          placeholder="Optional, auto = price * qty"
                        />
                      </div>
                    </div>

                    <div className="modal-footer">
                      <div>
                        {editSubmitting && (
                          <span style={{ color: "#9ca3af" }}>Saving…</span>
                        )}
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                        {editingId && (
                          <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={handleDeleteEdit}
                            disabled={editSubmitting}
                          >
                            Delete
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-ghost"
                          onClick={handleCloseEdit}
                          disabled={editSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleSaveEdit}
                          disabled={editSubmitting}
                        >
                          Save changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {items.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "0.8rem" }}>
                    No adjustment data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            className="btn btn-ghost"
            disabled={page <= 1 || loading}
            onClick={() => loadPage(page - 1)}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            className="btn btn-ghost"
            disabled={!hasMore || loading}
            onClick={() => loadPage(page + 1, { keepItems: true })}
          >
            Next
          </button>
          {loading && <span>Loading…</span>}
        </div>
      </div>
    </Layout>
  );
}