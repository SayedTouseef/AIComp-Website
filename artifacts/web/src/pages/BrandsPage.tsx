import { Link } from "wouter";
import { useListBrands } from "@workspace/api-client-react";

export default function BrandsPage() {
  const { data, isLoading } = useListBrands();
  const brands: any[] = (data as any)?.data ?? [];

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>Brands</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        All Brands
      </h1>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 6 }} />)}
        </div>
      ) : brands.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
          {brands.map((b: any, i) => (
            <Link key={b.id ?? i} href={`/brand/${b.slug}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "16px 12px", textDecoration: "none", transition: "border-color 0.15s" }} data-testid={`brand-${b.slug}`}>
              {b.logoUrl ? (
                <img src={b.logoUrl} alt={b.name} style={{ width: 50, height: 30, objectFit: "contain" }} />
              ) : (
                <div style={{ width: 50, height: 30, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏢</div>
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", textAlign: "center" }}>{b.name}</span>
              {b.productCount > 0 && <span style={{ fontSize: 11, color: "var(--text3)" }}>{b.productCount} products</span>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <div className="empty-state-title">No brands yet</div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Brands will appear here once products are added.</p>
        </div>
      )}
    </div>
  );
}
