import { useRoute, Link, useLocation } from "wouter";
import { Star, GitCompare, Heart, ExternalLink, ArrowLeft, Zap } from "lucide-react";
import { useState } from "react";
import { useGetProduct, useGetProductPrices, useListSimilarProducts, getGetProductQueryKey, getGetProductPricesQueryKey, getListSimilarProductsQueryKey } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:slug");
  const slug = params?.slug ?? "";
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "prices">("overview");
  const [wishlisted, setWishlisted] = useState(false);
  const [, navigate] = useLocation();

  const { data: product, isLoading, error } = useGetProduct(slug, { query: { enabled: !!slug, queryKey: getGetProductQueryKey(slug) } });
  const { data: pricesData } = useGetProductPrices(slug, { query: { enabled: !!slug, queryKey: getGetProductPricesQueryKey(slug) } });
  const { data: similarData } = useListSimilarProducts(slug, { query: { enabled: !!slug, queryKey: getListSimilarProductsQueryKey(slug) } });

  const prices: any[] = (pricesData as any)?.data ?? [];
  const similar: any[] = (similarData as any)?.data ?? [];
  const p = product as any;

  if (isLoading) return (
    <div style={{ padding: "16px 0" }}>
      <div className="skeleton" style={{ height: 20, width: "30%", marginBottom: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
        <div className="skeleton" style={{ aspectRatio: "1", borderRadius: 8 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="skeleton" style={{ height: 28, width: "70%" }} />
          <div className="skeleton" style={{ height: 16, width: "40%" }} />
          <div className="skeleton" style={{ height: 40, width: "50%" }} />
        </div>
      </div>
    </div>
  );

  if (error || !p) return (
    <div className="empty-state" style={{ padding: "64px 16px" }}>
      <div className="empty-state-icon">🔍</div>
      <div className="empty-state-title">Product not found</div>
      <p style={{ fontSize: 13, color: "var(--text3)" }}>This product may have been removed or the URL is incorrect.</p>
      <Link href="/" style={{ color: "var(--blue)", fontSize: 13, marginTop: 12, display: "inline-block" }}>← Back to Home</Link>
    </div>
  );

  const specs = typeof p.specs === "object" && p.specs ? p.specs as Record<string, any> : {};
  const ratingNum = p.rating ? Number(p.rating) : 0;

  return (
    <div style={{ padding: "0 0 32px" }}>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href="/category/smartphones">Smartphones</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>{p.name}</span>
      </div>

      {/* Product Hero */}
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24, alignItems: "start", marginBottom: 24 }}>
        <div>
          <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 16, marginBottom: 10 }}>
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: 240, objectFit: "contain" }} />
            ) : (
              <div style={{ width: "100%", height: 240, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64 }}>📱</div>
            )}
          </div>
          {prices.length > 0 && (
            <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 8, padding: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "var(--text3)", letterSpacing: 1, marginBottom: 8 }}>Buy Now</div>
              {prices.slice(0, 3).map((price: any, i: number) => (
                <a key={i} href={price.url ?? "#"} target="_blank" rel="noreferrer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < prices.length - 1 ? "1px solid var(--border)" : "none" }} data-testid={`price-row-${i}`}>
                  <span style={{ fontSize: 13, color: "var(--text2)" }}>{price.retailer}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--green)" }}>₹{Number(price.price).toLocaleString("en-IN")}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 24, fontWeight: 700, color: "var(--text)", margin: "0 0 8px" }}>
            {p.name}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            {ratingNum > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} fill={i < Math.round(ratingNum) ? "#f0883e" : "none"} color="#f0883e" />
                ))}
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--orange)", marginLeft: 4 }}>{ratingNum.toFixed(1)}</span>
                <span style={{ fontSize: 12, color: "var(--text3)" }}>({p.reviewCount?.toLocaleString() ?? 0} reviews)</span>
              </div>
            )}
          </div>

          {p.priceFrom && (
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontSize: 28, fontWeight: 700, color: "var(--green)" }}>
                ₹{Number(p.priceFrom).toLocaleString("en-IN")}
              </span>
              {p.priceTo && p.priceTo !== p.priceFrom && (
                <span style={{ fontSize: 18, color: "var(--text3)", marginLeft: 6 }}>
                  – ₹{Number(p.priceTo).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <button
              onClick={() => navigate(`/compare?slugs=${slug}`)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--blue)", color: "#fff", border: "none", borderRadius: 4, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              data-testid="btn-compare"
            >
              <GitCompare size={14} /> Compare
            </button>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg2)", color: wishlisted ? "var(--red)" : "var(--text2)", border: "1px solid var(--border2)", borderRadius: 4, padding: "9px 14px", fontSize: 13, cursor: "pointer" }}
              data-testid="btn-wishlist"
            >
              <Heart size={14} fill={wishlisted ? "currentColor" : "none"} />
              {wishlisted ? "Saved" : "Wishlist"}
            </button>
          </div>

          {p.description && (
            <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.7, marginBottom: 16 }}>{p.description}</p>
          )}

          {/* Quick Specs */}
          {Object.keys(specs).length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {Object.entries(specs).slice(0, 6).map(([key, val]) => (
                <div key={key} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 12px" }}>
                  <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>{key}</div>
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{String(val)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-bar">
        {(["overview", "specs", "prices"] as const).map(tab => (
          <button key={tab} className={`tab-item${activeTab === tab ? " active" : ""}`} onClick={() => setActiveTab(tab)} data-testid={`tab-${tab}`} style={{ background: "none", border: "none", cursor: "pointer" }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ color: "var(--text2)", fontSize: 14, lineHeight: 1.8 }}>
          {p.description ?? "Detailed overview coming soon."}
        </div>
      )}

      {activeTab === "specs" && (
        <table className="spec-table">
          <tbody>
            {Object.entries(specs).length > 0
              ? Object.entries(specs).map(([key, val]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{String(val)}</td>
                </tr>
              ))
              : (
                <tr>
                  <td colSpan={2} style={{ textAlign: "center", color: "var(--text3)", padding: 32 }}>
                    Specs not available
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      )}

      {activeTab === "prices" && (
        <div>
          {prices.length > 0 ? prices.map((price: any, i: number) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: "12px 16px", marginBottom: 8 }} data-testid={`price-detail-${i}`}>
              <span style={{ fontSize: 14, color: "var(--text)" }}>{price.retailer}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: "var(--green)" }}>₹{Number(price.price).toLocaleString("en-IN")}</span>
                {price.url && (
                  <a href={price.url} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--orange)", color: "#fff", padding: "5px 12px", borderRadius: 4, fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                    Buy <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          )) : (
            <div className="empty-state"><div className="empty-state-icon">💰</div><div className="empty-state-title">No prices available</div></div>
          )}
        </div>
      )}

      {/* Similar Products */}
      {similar.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <div className="section-head">
            <h2 className="section-title">Similar <span className="section-title-accent">Products</span></h2>
          </div>
          <div className="product-grid">
            {similar.map((p: any) => (
              <ProductCard key={p.id} id={p.id} slug={p.slug} name={p.name} imageUrl={p.imageUrl} priceFrom={p.priceFrom} rating={p.rating} reviewCount={p.reviewCount} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
