import { useRoute, Link } from "wouter";
import { useFetchBrandProducts, getFetchBrandProductsQueryKey } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { useState } from "react";

export default function BrandPage() {
  const [, params] = useRoute("/brand/:slug");
  const slug = params?.slug ?? "";
  const [compareList, setCompareList] = useState<string[]>([]);

  const { data, isLoading, error } = useFetchBrandProducts(slug, { query: { enabled: !!slug, queryKey: getFetchBrandProductsQueryKey(slug) } });
  const brand: any = (data as any)?.brand;
  const products: any[] = (data as any)?.products?.data ?? [];

  function toggleCompare(s: string) {
    setCompareList(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 4 ? [...prev, s] : prev);
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href="/brands">Brands</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>{brand?.name ?? slug}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
        {brand?.logoUrl && (
          <img src={brand.logoUrl} alt={brand.name} style={{ width: 60, height: 60, objectFit: "contain", background: "var(--bg2)", borderRadius: 8, padding: 8, border: "1px solid var(--border)" }} />
        )}
        <div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text)", margin: "0 0 4px" }}>
            {brand?.name ?? slug}
          </h1>
          {brand?.country && <div style={{ fontSize: 12, color: "var(--text3)" }}>📍 {brand.country}</div>}
          {brand?.productCount > 0 && <div style={{ fontSize: 12, color: "var(--text3)" }}>{brand.productCount} products</div>}
        </div>
      </div>

      {isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-title">Brand not found</div>
          <Link href="/brands" style={{ color: "var(--blue)", fontSize: 13 }}>← All Brands</Link>
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
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <div className="empty-state-title">No products from {brand?.name ?? slug} yet</div>
        </div>
      )}
    </div>
  );
}
