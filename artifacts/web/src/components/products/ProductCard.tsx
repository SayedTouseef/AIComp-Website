import { Link } from "wouter";
import { Star, GitCompare, Heart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  imageUrl?: string | null;
  priceFrom?: string | null;
  priceTo?: string | null;
  rating?: string | null;
  reviewCount?: number;
  brandName?: string;
  onCompare?: (slug: string) => void;
  inCompare?: boolean;
}

export function ProductCard({
  id, slug, name, imageUrl, priceFrom, priceTo, rating, reviewCount,
  brandName, onCompare, inCompare,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false);

  function formatPrice(price?: string | null) {
    if (!price) return null;
    return `₹${Number(price).toLocaleString("en-IN")}`;
  }

  const stars = rating ? Math.round(Number(rating)) : 0;

  return (
    <div className="product-card" data-testid={`card-product-${id}`}>
      <div style={{ position: "relative" }}>
        <Link href={`/product/${slug}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="product-card-image"
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
            />
          ) : (
            <div className="product-card-image" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text3)", fontSize: 32 }}>
              📱
            </div>
          )}
        </Link>
        <button
          onClick={() => setWishlisted(!wishlisted)}
          style={{ position: "absolute", top: 6, right: 6, background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%", width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: wishlisted ? "#e05c5c" : "var(--text3)" }}
          data-testid={`btn-wishlist-${id}`}
        >
          <Heart size={12} fill={wishlisted ? "#e05c5c" : "none"} />
        </button>
      </div>

      <div className="product-card-body">
        {brandName && <div className="product-card-brand">{brandName}</div>}
        <Link href={`/product/${slug}`} className="product-card-name" style={{ color: "var(--text)", textDecoration: "none" }} data-testid={`link-product-${id}`}>
          {name}
        </Link>

        {rating && (
          <div className="product-card-rating">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={10} fill={i < stars ? "currentColor" : "none"} />
            ))}
            <span style={{ color: "var(--text3)", fontSize: 11 }}>
              ({reviewCount?.toLocaleString() ?? 0})
            </span>
          </div>
        )}

        <div className="product-card-price">
          {formatPrice(priceFrom) ?? "Check Price"}
          {priceTo && priceFrom !== priceTo && (
            <span className="product-card-price-sub"> – {formatPrice(priceTo)}</span>
          )}
        </div>

        <div className="product-card-actions">
          <Link href={`/product/${slug}`} className="product-card-btn product-card-btn-primary" style={{ textAlign: "center", lineHeight: "28px", textDecoration: "none" }} data-testid={`btn-view-${id}`}>
            View
          </Link>
          <button
            className={`product-card-btn product-card-btn-secondary${inCompare ? " compare-active" : ""}`}
            onClick={() => onCompare?.(slug)}
            style={inCompare ? { background: "var(--blue)", color: "#fff", border: "none" } : {}}
            data-testid={`btn-compare-${id}`}
          >
            <GitCompare size={10} style={{ display: "inline", marginRight: 3 }} />
            {inCompare ? "Added" : "Compare"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="product-card">
      <div className="skeleton" style={{ width: "100%", aspectRatio: "4/3" }} />
      <div className="product-card-body" style={{ gap: 8 }}>
        <div className="skeleton" style={{ height: 10, width: "40%" }} />
        <div className="skeleton" style={{ height: 14, width: "90%" }} />
        <div className="skeleton" style={{ height: 14, width: "70%" }} />
        <div className="skeleton" style={{ height: 18, width: "50%" }} />
        <div style={{ display: "flex", gap: 6 }}>
          <div className="skeleton" style={{ flex: 1, height: 28 }} />
          <div className="skeleton" style={{ flex: 1, height: 28 }} />
        </div>
      </div>
    </div>
  );
}
