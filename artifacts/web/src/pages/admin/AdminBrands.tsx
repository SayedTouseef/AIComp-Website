import { useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";

interface Brand {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string;
  country?: string;
}

export default function AdminBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", logoUrl: "", country: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/v1/admin/brands");
      const data = await r.json();
      setBrands(data.data ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function addBrand() {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      const body: any = { name: form.name, slug: form.slug };
      if (form.logoUrl) body.logoUrl = form.logoUrl;
      if (form.country) body.country = form.country;
      await fetch("/api/v1/admin/brands", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      setShowAdd(false);
      setForm({ name: "", slug: "", logoUrl: "", country: "" });
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
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Brands</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>{brands.length} brands</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--nav-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAdd(v => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
            <Plus size={15} /> Add Brand
          </button>
        </div>
      </div>

      {showAdd && (
        <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600 }}>New Brand</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { key: "name", label: "Brand Name *", placeholder: "e.g. Samsung" },
              { key: "slug", label: "Slug *", placeholder: "e.g. samsung" },
              { key: "country", label: "Country", placeholder: "e.g. South Korea" },
              { key: "logoUrl", label: "Logo URL", placeholder: "https://..." },
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
            <button onClick={addBrand} disabled={saving || !form.name || !form.slug} style={{ padding: "8px 18px", background: "var(--green)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>
              {saving ? "Saving\u2026" : "Save Brand"}
            </button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "8px 14px", background: "none", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", color: "var(--text-muted)", fontSize: 13 }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading\u2026</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["ID", "Logo", "Name", "Slug", "Country"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: .5, borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {brands.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)" }}>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{b.id}</td>
                  <td style={{ padding: "10px 14px" }}>
                    {b.logoUrl ? (
                      <img src={b.logoUrl} alt={b.name} style={{ width: 32, height: 32, objectFit: "contain", borderRadius: 4, background: "#fff" }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: 4, background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text-muted)" }}>N/A</div>
                    )}
                  </td>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{b.name}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontFamily: "monospace", fontSize: 12 }}>{b.slug}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>{b.country ?? "\u2014"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
