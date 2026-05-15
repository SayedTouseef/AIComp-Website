import { Link } from "wouter";
import { useListLaunches } from "@workspace/api-client-react";

export default function LaunchesPage() {
  const { data, isLoading } = useListLaunches({ limit: 50 });
  const launches: any[] = (data as any)?.data ?? [];

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>Upcoming Launches</span>
      </div>

      <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
        Upcoming Phone Launches
      </h1>

      {isLoading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 6 }} />)}
        </div>
      ) : launches.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
          {launches.map((l: any, i) => (
            <div key={l.id ?? i} style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 6, padding: 14 }} data-testid={`launch-${i}`}>
              {l.imageUrl && <img src={l.imageUrl} alt={l.name} style={{ width: "100%", height: 80, objectFit: "contain", marginBottom: 8 }} />}
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{l.name}</div>
              <div style={{ fontSize: 11, color: "var(--blue)", marginBottom: 4 }}>{l.brand}</div>
              {l.expectedPrice && <div style={{ fontSize: 13, color: "var(--green)", fontWeight: 700 }}>~{l.expectedPrice}</div>}
              {l.launchDate && (
                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 4 }}>
                  {new Date(l.launchDate).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
                </div>
              )}
              {l.isConfirmed && <div style={{ marginTop: 6 }}><span className="badge badge-green">Confirmed</span></div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <div className="empty-state-title">No upcoming launches listed</div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Check back soon for the latest upcoming phone launches.</p>
        </div>
      )}
    </div>
  );
}
