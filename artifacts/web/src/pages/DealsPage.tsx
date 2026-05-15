import { Link } from "wouter";
import { Zap } from "lucide-react";
import { useListDeals, useGetFlashDeals } from "@workspace/api-client-react";

export default function DealsPage() {
  const { data: dealsData, isLoading } = useListDeals({ page: 1 });
  const { data: flashData } = useGetFlashDeals({ limit: 8 });

  const deals: any[] = (dealsData as any)?.data ?? [];
  const flash: any[] = (flashData as any)?.data ?? [];

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>Deals</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        <Zap size={18} style={{ display: "inline", marginRight: 6, color: "var(--orange)" }} />
        Best Deals
      </h1>

      {flash.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <div className="section-head">
            <h2 className="section-title">⚡ <span className="section-title-accent">Flash</span> Deals</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {flash.map((deal: any, i) => (
              <div key={deal.id ?? i} className="deal-card" data-testid={`flash-deal-${i}`}>
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
        </section>
      )}

      <section>
        <div className="section-head">
          <h2 className="section-title">All <span className="section-title-accent">Deals</span></h2>
        </div>
        {isLoading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 80, borderRadius: 6 }} />
            ))}
          </div>
        ) : deals.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
            {deals.map((deal: any, i) => (
              <div key={deal.id ?? i} className="deal-card" data-testid={`deal-${i}`}>
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
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🏷️</div>
            <div className="empty-state-title">No deals right now</div>
            <p style={{ fontSize: 13, color: "var(--text3)" }}>Check back soon for the latest discounts.</p>
          </div>
        )}
      </section>
    </div>
  );
}
