import { Link } from "wouter";
import { useListGuides } from "@workspace/api-client-react";

export default function GuidesPage() {
  const { data, isLoading } = useListGuides({ page: 1 });
  const guides: any[] = (data as any)?.data ?? [];

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>Buying Guides</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        Buying Guides & Reviews
      </h1>

      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 6 }} />)}
        </div>
      ) : guides.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {guides.map((g: any, i) => (
            <Link key={g.id ?? i} href={`/guide/${g.slug}`} style={{ display: "flex", gap: 16, background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: 14, textDecoration: "none", transition: "border-color 0.15s" }} data-testid={`guide-${i}`}>
              {g.imageUrl && (
                <img src={g.imageUrl} alt={g.title} style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
              )}
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", marginBottom: 6 }}>{g.title}</div>
                {g.excerpt && <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.5 }}>{g.excerpt}</div>}
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 8 }}>
                  {g.author} · {g.readTime} min read
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <div className="empty-state-title">No guides yet</div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Buying guides and reviews will appear here.</p>
        </div>
      )}
    </div>
  );
}
