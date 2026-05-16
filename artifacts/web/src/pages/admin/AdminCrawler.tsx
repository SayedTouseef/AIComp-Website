import { useEffect, useState } from "react";
import { Radio, Play, RefreshCw } from "lucide-react";

interface Job {
  id: number;
  source: string;
  targetUrl?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const STATUS_COLOR: Record<string, string> = {
  pending: "var(--orange)",
  running: "var(--blue)",
  done: "var(--green)",
  failed: "#ef4444",
};

export default function AdminCrawler() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [triggerForm, setTriggerForm] = useState({ source: "manual", targetUrl: "" });
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);

  async function load(pg = 1) {
    setLoading(true);
    try {
      const r = await fetch(`/api/v1/admin/crawler/jobs?page=${pg}&limit=20`);
      const data = await r.json();
      setJobs(data.data ?? []);
      setTotal(data.pagination?.total ?? 0);
      setPages(data.pagination?.pages ?? 1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(page); }, [page]);

  async function triggerCrawl() {
    setTriggering(true);
    setTriggerResult(null);
    try {
      const r = await fetch("/api/v1/admin/crawler/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(triggerForm),
      });
      const data = await r.json();
      setTriggerResult(`Job #${data.job?.id} queued \u2014 ${data.message}`);
      load(1);
    } catch {
      setTriggerResult("Failed to trigger crawler");
    } finally {
      setTriggering(false);
    }
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Crawler</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 13, margin: "4px 0 0" }}>{total} jobs total</p>
        </div>
        <button onClick={() => load(page)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: "var(--nav-bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Radio size={16} style={{ color: "var(--blue)" }} />
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Trigger Crawler Job</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Source</label>
            <select
              value={triggerForm.source}
              onChange={e => setTriggerForm(f => ({ ...f, source: e.target.value }))}
              style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13 }}
            >
              <option value="manual">manual</option>
              <option value="gsmarena">gsmarena</option>
              <option value="flipkart">flipkart</option>
              <option value="amazon">amazon</option>
              <option value="91mobiles">91mobiles</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, color: "var(--text-muted)", marginBottom: 4 }}>Target URL (optional)</label>
            <input
              value={triggerForm.targetUrl}
              onChange={e => setTriggerForm(f => ({ ...f, targetUrl: e.target.value }))}
              placeholder="https://..."
              style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "8px 10px", color: "var(--text)", fontSize: 13, boxSizing: "border-box" }}
            />
          </div>
        </div>
        <button
          onClick={triggerCrawl}
          disabled={triggering}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 20px", background: "var(--orange)", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600, opacity: triggering ? 0.7 : 1 }}
        >
          <Play size={14} /> {triggering ? "Triggering\u2026" : "Run Crawler"}
        </button>
        {triggerResult && (
          <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(61,184,122,.1)", border: "1px solid var(--green)", borderRadius: 6, fontSize: 13, color: "var(--green)" }}>
            {triggerResult}
          </div>
        )}
      </div>

      <div style={{ background: "var(--nav-bg)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", fontWeight: 600, fontSize: 14 }}>
          Job History
        </div>
        {loading ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>Loading\u2026</div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>No crawler jobs yet. Trigger one above.</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "var(--bg)" }}>
                {["ID", "Source", "Target URL", "Status", "Created"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "var(--text-muted)", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: .5, borderBottom: "1px solid var(--border)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {jobs.map((j, i) => (
                <tr key={j.id} style={{ borderBottom: "1px solid var(--border)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,.02)" }}>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)" }}>#{j.id}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{j.source}</td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontFamily: "monospace", fontSize: 11, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {j.targetUrl ?? "\u2014"}
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 20, background: (STATUS_COLOR[j.status] ?? "var(--text-muted)") + "22", color: STATUS_COLOR[j.status] ?? "var(--text-muted)", fontWeight: 600 }}>
                      {j.status}
                    </span>
                  </td>
                  <td style={{ padding: "10px 14px", color: "var(--text-muted)", fontSize: 12 }}>
                    {j.createdAt ? new Date(j.createdAt).toLocaleString("en-IN") : "\u2014"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {pages > 1 && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: "6px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", cursor: "pointer", fontSize: 13, opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
            <span style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", alignItems: "center" }}>Page {page} of {pages}</span>
            <button disabled={page === pages} onClick={() => setPage(p => p + 1)} style={{ padding: "6px 12px", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, color: "var(--text)", cursor: "pointer", fontSize: 13, opacity: page === pages ? 0.4 : 1 }}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
