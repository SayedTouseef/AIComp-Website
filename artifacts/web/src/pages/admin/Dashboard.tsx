import { useEffect, useState } from "react";
import { Package, Tag, Award, TrendingUp, RefreshCw } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalBrands: number;
  productsByCategory: { categoryId: number; count: number }[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch("/api/v1/admin/stats");
      setStats(await r.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const cards = [
    { label: "Total Products", value: stats?.totalProducts ?? "—", icon: Package, color: "var(--blue)" },
    { label: "Categories", value: stats?.totalCategories ?? "—", icon: Tag, color: "var(--green)" },
    { label: "Brands", value: stats?.totalBrands ?? "—", icon: Award, color: "var(--orange)" },
    { label: "By Category Groups", value: stats?.productsByCategory?.length ?? "—", icon: TrendingUp, color: "#a855f7" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>Overview of your AIComp database</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}
        >
          <RefreshCw size={14} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          Refresh
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} style={{
            background: "var(--nav-bg)", border: "1px solid var(--border)",
            borderRadius: 10, padding: "20px 24px",
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{loading ? "…" : value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
            </div>
          </div>
        ))}
      </div>

      {stats && stats.productsByCategory.length > 0 && (
        <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 16px" }}>Products by Category</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.productsByCategory.map(({ categoryId, count }) => {
              const max = Math.max(...stats.productsByCategory.map(c => c.count));
              return (
                <div key={categoryId} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--text-muted)", width: 100, flexShrink: 0 }}>
                    Category #{categoryId}
                  </span>
                  <div style={{ flex: 1, background: "var(--border)", borderRadius: 4, height: 8, overflow: "hidden" }}>
                    <div style={{ width: `${(count / max) * 100}%`, height: "100%", background: "var(--blue)", borderRadius: 4 }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, width: 32, textAlign: "right" }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
