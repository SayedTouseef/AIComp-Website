import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  sortOrder?: number;
}

export default function AdminCategories() {
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", icon: "", sortOrder: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/v1/admin/categories");
      const data = await r.json();
      setCats(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addCategory() {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const body: any = { name: form.name, slug: form.slug };
      if (form.icon) body.icon = form.icon;
      if (form.sortOrder) body.sortOrder = parseInt(form.sortOrder);
      await fetch("/api/v1/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setShowAdd(false);
      setForm({ name: "", slug: "", icon: "", sortOrder: "" });
      load();
    } finally {
      setSaving(false);
    }
  }

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Categories</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>{cats.length} categories</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--nav-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAdd(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            <Plus size={15} /> Add Category
          </button>
        </div>
      </div>

      {showAdd && (
        <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>New Category</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "name", label: "Name *", placeholder: "e.g. Smartphones" },
              { key: "slug", label: "Slug *", placeholder: "e.g. smartphones" },
              { key: "icon", label: "Icon (emoji or name)", placeholder: "e.g. 📱" },
              { key: "sortOrder", label: "Sort Order", placeholder: "e.g. 1" },
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
            <button onClick={addCategory} disabled={saving || !form.name || !form.slug} style={{ padding: "8px 18px", background: "var(--green)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              {saving ? "Saving…" : "Save Category"}
            </button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "8px 14px", background: "none", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", color: "var(--text-muted)", fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading…</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["ID", "Icon", "Name", "Slug", "Sort Order"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: .5, borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cats.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)" }}>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{c.id}</td>
                  <td style={{ padding: "10px 14px", fontSize: 20 }}>{c.icon ?? "—"}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontFamily: "monospace", fontSize: 12 }}>{c.slug}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{c.sortOrder ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
