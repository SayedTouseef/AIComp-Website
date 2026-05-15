import { useRoute, Link } from "wouter";
import { useFetchCategoryProducts, getFetchCategoryProductsQueryKey } from "@workspace/api-client-react";
import { ProductCard, ProductCardSkeleton } from "@/components/products/ProductCard";
import { useState } from "react";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const slug = params?.slug ?? "";
  const [compareList, setCompareList] = useState<string[]>([]);

  const { data, isLoading, error } = useFetchCategoryProducts(slug, { query: { enabled: !!slug, queryKey: getFetchCategoryProductsQueryKey(slug) } });
  const category: any = (data as any)?.category;
  const products: any[] = (data as any)?.products?.data ?? [];

  function toggleCompare(s: string) {
    setCompareList(prev => prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 4 ? [...prev, s] : prev);
  }

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>{category?.name ?? slug}</span>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text)", margin: "0 0 6px" }}>
          {category?.name ?? slug}
        </h1>
        {category?.description && (
          <p style={{ fontSize: 14, color: "var(--text3)", margin: 0 }}>{category.description}</p>
        )}
        {category?.productCount > 0 && (
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>{category.productCount} products</div>
        )}
      </div>

      {isLoading ? (
        <div className="product-grid">
          {Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <div className="empty-state">
          <div className="empty-state-icon">⚠️</div>
          <div className="empty-state-title">Category not found</div>
          <Link href="/" style={{ color: "var(--blue)", fontSize: 13 }}>← Back to Home</Link>
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
          <div className="empty-state-title">No products yet</div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Products in this category will appear here once added.</p>
        </div>
      )}
    </div>
  );
}
