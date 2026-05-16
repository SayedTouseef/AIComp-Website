import { useEffect, useState } from "react";
import { Search, Plus, Trash2, Edit2, X, Check, RefreshCw } from "lucide-react";

interface Product {
  id: number;
  name: string;
  slug: string;
  brand?: string;
  price?: number;
  status?: string;
  categoryId?: number;
  createdAt?: string;
}

interface AddForm {
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  price: string;
  description: string;
}

const EMPTY_FORM: AddForm = { name: "", slug: "", brandId: "", categoryId: "", price: "", description: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<AddForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  async function load(pg = page, search = q) {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pg), limit: "20" });
      if (search) params.set("q", search);
      const r = await fetch(`/api/v1/admin/products?${params}`);
      const data = await r.json();
      setProducts(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPages(data.pagination?.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(1, q); setPage(1); }, [q]);
  useEffect(() => { load(page, q); }, [page]);

  async function addProduct() {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const body: any = { name: form.name, slug: form.slug, description: form.description };
      if (form.brandId) body.brandId = parseInt(form.brandId);
      if (form.categoryId) body.categoryId = parseInt(form.categoryId);
      if (form.price) body.price = parseFloat(form.price);
      await fetch("/api/v1/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setShowAdd(false);
      setForm(EMPTY_FORM);
      load(1, q);
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: number) {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/v1/admin/products/${id}`, { method: "DELETE" });
      load(page, q);
    } finally {
      setDeletingId(null);
    }
  }

  async function saveEdit(id: number) {
    setSaving(true);
    try {
      await fetch(`/api/v1/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      setEditingId(null);
      load(page, q);
    } finally {
      setSaving(false);
    }
  }

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Products</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>{total} products total</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => load(page, q)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--nav-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAdd(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            <Plus size={15} /> Add Product
          </button>
        </div>
      </div>

      {showAdd && (
        <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>New Product</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "name", label: "Name *", placeholder: "e.g. Samsung Galaxy S25" },
              { key: "slug", label: "Slug *", placeholder: "e.g. samsung-galaxy-s25" },
              { key: "brandId", label: "Brand ID", placeholder: "e.g. 1" },
              { key: "categoryId", label: "Category ID", placeholder: "e.g. 1" },
              { key: "price", label: "Price (₹)", placeholder: "e.g. 79999" },
              { key: "description", label: "Description", placeholder: "Short description..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={e => {
                    const val = e.target.value;
                    setForm(f => ({
                      ...f,
                      [key]: val,
                      ...(key === "name" && !f.slug ? { slug: slugify(val) } : {}),
                    }));
                  }}
                  placeholder={placeholder}
                  style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13, boxSizing: "border-box" }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            <button onClick={addProduct} disabled={saving || !form.name || !form.slug} style={{ padding: "8px 18px", background: "var(--green)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500, opacity: saving ? 0.7 : 1 }}>
              {saving ? "Saving…" : "Save Product"}
            </button>
            <button onClick={() => { setShowAdd(false); setForm(EMPTY_FORM); }} style={{ padding: "8px 14px", background: "none", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", color: "var(--text-muted)", fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search products…"
              style={{ width: "100%", paddingLeft: 32, padding: "8px 8px 8px 32px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", fontSize: 13, boxSizing: "border-box" }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : products.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No products found</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--bg)" }}>
                  {["ID", "Name", "Slug", "Cat ID", "Brand ID", "Status", "Actions"].map(h => (
                    <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: .5, borderBottom: "1px solid var(--border)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)" }}>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{p.id}</td>
                    <td style={{ padding: "10px 14px", fontWeight: 500 }}>
                      {editingId === p.id ? (
                        <input value={editForm.name ?? p.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} style={{ background: "var(--bg)", border: "1px solid var(--blue)", borderRadius: 4, padding: "4px 8px", color: "var(--text)", fontSize: 13, width: 180 }} />
                      ) : p.name}
                    </td>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontFamily: "monospace", fontSize: 12 }}>{p.slug}</td>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{(p as any).categoryId ?? "—"}</td>
                    <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{(p as any).brandId ?? "—"}</td>
                    <td style={{ padding: "10px 14px" }}>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: p.status === "active" ? "rgba(61,184,122,.15)" : "rgba(240,136,62,.15)", color: p.status === "active" ? "var(--green)" : "var(--orange)", fontWeight: 600 }}>
                        {p.status ?? "active"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 14px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {editingId === p.id ? (
                          <>
                            <button onClick={() => saveEdit(p.id)} disabled={saving} style={{ background: "var(--green)", border: "none", borderRadius: 4, padding: "4px 8px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                              <Check size={12} /> Save
                            </button>
                            <button onClick={() => setEditingId(null)} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 8px", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                              <X size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => { setEditingId(p.id); setEditForm({ name: p.name }); }} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 8px", color: "var(--blue)", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                              <Edit2 size={12} /> Edit
                            </button>
                            <button onClick={() => deleteProduct(p.id)} disabled={deletingId === p.id} style={{ background: "none", border: "1px solid var(--border)", borderRadius: 4, padding: "4px 8px", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                              <Trash2 size={12} /> {deletingId === p.id ? "…" : "Delete"}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pages > 1 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", cursor: "pointer", fontSize: 13, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Page {page} of {pages}</span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", cursor: "pointer", fontSize: 13, opacity: page === pages ? 0.4 : 1 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
