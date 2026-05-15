import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useSearchProducts, getSearchProductsQueryKey } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";

export default function Search() {
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const q = params.get("q") ?? "";
  const [inputValue, setInputValue] = useState(q);
  const [compareList, setCompareList] = useState<string[]>([]);

  const searchParams = { q, page: 1, limit: 24 };
  const { data, isLoading } = useSearchProducts(
    searchParams,
    { query: { enabled: q.length > 0, queryKey: getSearchProductsQueryKey(searchParams) } }
  );

  useEffect(() => { setInputValue(q); }, [q]);

  const products: any[] = (data as any)?.data ?? [];
  const total: number = (data as any)?.pagination?.total ?? 0;

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (inputValue.trim()) navigate(`/search?q=${encodeURIComponent(inputValue.trim())}`);
  }

  function toggleCompare(slug: string) {
    setCompareList(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : prev.length < 4 ? [...prev, slug] : prev
    );
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>Search</span>
      </div>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Search for phones, tablets, laptops..."
            style={{ width: "100%", height: 40, background: "var(--bg2)", border: "1px solid var(--border2)", borderRadius: 6, color: "var(--text)", fontSize: 14, padding: "0 40px 0 14px", outline: "none" }}
            data-testid="search-page-input"
          />
          <SearchIcon size={16} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }} />
        </div>
        <button type="submit" style={{ background: "var(--blue)", color: "#fff", border: "none", borderRadius: 6, padding: "0 20px", fontSize: 14, fontWeight: 600, cursor: "pointer" }} data-testid="search-submit">
          Search
        </button>
      </form>

      {q && (
        <div style={{ marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 14, color: "var(--text3)" }}>
            {isLoading ? "Searching..." : `${total} results for `}
            {!isLoading && <strong style={{ color: "var(--text)" }}>"{q}"</strong>}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length > 0 ? (
        <div className="product-grid">
          {products.map((p: any) => (
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
      ) : q ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">No results for "{q}"</div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Try different keywords or browse by category.</p>
          <Link href="/" style={{ color: "var(--blue)", fontSize: 13, marginTop: 12, display: "inline-block" }}>← Browse all products</Link>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-title">Search for anything</div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Find phones, tablets, laptops and more.</p>
        </div>
      )}
    </div>
  );
}
