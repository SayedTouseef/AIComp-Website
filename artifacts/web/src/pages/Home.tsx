import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Zap, TrendingUp, Sparkles } from "lucide-react";
import {
  useGetFeaturedProducts,
  useGetTrendingProducts,
  useListCategories,
  useGetFlashDeals,
  useListLaunches,
} from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { CompareBar } from "@/components/products/CompareBar";

export default function Home() {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [, navigate] = useLocation();

  const { data: featuredData, isLoading: loadingFeatured } = useGetFeaturedProducts({ limit: 12 });
  const { data: trendingData, isLoading: loadingTrending } = useGetTrendingProducts({ limit: 10 });
  const { data: categoriesData } = useListCategories();
  const { data: dealsData } = useGetFlashDeals({ limit: 6 });
  const { data: launchesData } = useListLaunches({ limit: 6 });

  const featured: any[] = (featuredData as any)?.data ?? [];
  const trending: any[] = (trendingData as any)?.data ?? [];
  const categories: any[] = (categoriesData as any)?.data ?? [];
  const deals: any[] = (dealsData as any)?.data ?? [];
  const launches: any[] = (launchesData as any)?.data ?? [];

  function toggleCompare(slug: string) {
    setCompareList(prev =>
      prev.includes(slug)
        ? prev.filter(s => s !== slug)
        : prev.length < 4 ? [...prev, slug] : prev
    );
  }

  return (
    <>
      <div style={{ padding: "0 0 32px" }}>
        {/* Trending Ticker */}
        {trending.length > 0 && (
          <div className="trending-ticker" style={{ margin: "10px 0 12px" }}>
            <span className="trending-label">
              <TrendingUp size={10} style={{ display: "inline", marginRight: 4 }} />
              Trending
            </span>
            <div className="trending-items">
              {trending.map((p: any, i: number) => (
                <Link key={p.slug} href={`/product/${p.slug}`} className="trending-item" data-testid={`trending-${i}`}>
                  {i + 1}. {p.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Hero Banner */}
        <div className="hero-banner">
          <div style={{ maxWidth: 480 }}>
            <div className="badge badge-blue" style={{ marginBottom: 12 }}>
              <Sparkles size={10} style={{ marginRight: 4 }} />
              AI-Powered Comparisons
            </div>
            <h1 className="hero-title">
              India's Smartest<br />Electronics Guide
            </h1>
            <p className="hero-sub">
              Compare 10,000+ gadgets with real-time prices, expert AI analysis and comprehensive specs.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link href="/compare" className="hero-cta" data-testid="hero-compare-cta">
                Start Comparing <ArrowRight size={14} />
              </Link>
              <Link href="/category/smartphones" className="hero-cta" style={{ background: "var(--bg2)", border: "1px solid var(--border2)" }} data-testid="hero-browse-cta">
                Browse Phones
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Quick Bar */}
        {categories.length > 0 && (
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", padding: "12px 0", marginBottom: 4 }}>
            {categories.map((cat: any) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "var(--text2)", whiteSpace: "nowrap", flexShrink: 0 }}
                data-testid={`quick-cat-${cat.slug}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* Featured Products */}
        <section>
          <div className="section-head">
            <h2 className="section-title">
              <span className="section-title-accent">Featured</span> Phones
            </h2>
            <Link href="/category/smartphones" className="section-more">See all →</Link>
          </div>
          <div className="product-grid">
            {loadingFeatured
              ? Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featured.length > 0
                ? featured.map((p: any) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    slug={p.slug}
                    name={p.name}
                    imageUrl={p.imageUrl}
                    priceFrom={p.priceFrom}
                    priceTo={p.priceTo}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                    onCompare={toggleCompare}
                    inCompare={compareList.includes(p.slug)}
                  />
                ))
                : (
                  <div className="empty-state" style={{ gridColumn: "1/-1" }}>
                    <div className="empty-state-icon">📱</div>
                    <div className="empty-state-title">No products yet</div>
                    <p style={{ fontSize: 13, color: "var(--text3)" }}>Import products via the admin panel to get started.</p>
                  </div>
                )
            }
          </div>
        </section>

        {/* Flash Deals */}
        {(deals.length > 0 || true) && (
          <section style={{ marginTop: 24 }}>
            <div className="section-head">
              <h2 className="section-title">
                <Zap size={14} style={{ display: "inline", marginRight: 6, color: "var(--orange)" }} />
                <span className="section-title-accent">Flash</span> Deals
              </h2>
              <Link href="/deals" className="section-more">View all →</Link>
            </div>
            {deals.length === 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                {[
                  { name: "Samsung Galaxy S24 FE", discount: 15, retailer: "Amazon", salePrice: "49999", originalPrice: "58999" },
                  { name: "OnePlus 12R", discount: 12, retailer: "Flipkart", salePrice: "39999", originalPrice: "45399" },
                  { name: "Realme GT 6T", discount: 20, retailer: "Realme Store", salePrice: "31999", originalPrice: "39999" },
                ].map((deal, i) => (
                  <div key={i} className="deal-card" data-testid={`deal-card-${i}`}>
                    <div style={{ background: "var(--bg3)", borderRadius: 6, width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 24 }}>📱</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{deal.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="deal-badge">-{deal.discount}%</span>
                        <span className="deal-price-old">₹{Number(deal.originalPrice).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="deal-price-new">₹{Number(deal.salePrice).toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)", flexShrink: 0 }}>{deal.retailer}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
                {deals.map((deal: any, i: number) => (
                  <div key={deal.id} className="deal-card" data-testid={`deal-card-${i}`}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{deal.title}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="deal-badge">-{deal.discount}%</span>
                        <span className="deal-price-old">₹{Number(deal.originalPrice).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="deal-price-new">₹{Number(deal.salePrice).toLocaleString("en-IN")}</div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{deal.retailer}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Upcoming Launches */}
        {launches.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <div className="section-head">
              <h2 className="section-title">
                <span className="section-title-accent">Upcoming</span> Launches
              </h2>
              <Link href="/launches" className="section-more">See all →</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {launches.slice(0, 6).map((l: any, i: number) => (
                <div key={l.id ?? i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: 12 }} data-testid={`launch-${i}`}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{l.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 6 }}>{l.brand}</div>
                  {l.expectedPrice && (
                    <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>~{l.expectedPrice}</div>
                  )}
                  {l.launchDate && (
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                      {new Date(l.launchDate).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Trending Products */}
        {trending.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <div className="section-head">
              <h2 className="section-title">
                <TrendingUp size={14} style={{ display: "inline", marginRight: 6 }} />
                <span className="section-title-accent">Trending</span> Now
              </h2>
            </div>
            <div className="product-grid">
              {trending.map((p: any) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  imageUrl={p.imageUrl}
                  priceFrom={p.priceFrom}
                  priceTo={p.priceTo}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  onCompare={toggleCompare}
                  inCompare={compareList.includes(p.slug)}
                />
              ))}
            </div>
          </section>
        )}
      </div>

      {compareList.length > 0 && (
        <CompareBar
          slugs={compareList}
          onRemove={(slug) => toggleCompare(slug)}
          onClear={() => setCompareList([])}
          onCompare={() => navigate(`/compare?slugs=${compareList.join(",")}`)}
        />
      )}
    </>
  );
}
