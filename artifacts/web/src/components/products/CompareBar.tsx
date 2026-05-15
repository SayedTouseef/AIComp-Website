import { X, GitCompare } from "lucide-react";

interface CompareBarProps {
  slugs: string[];
  onRemove: (slug: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

export function CompareBar({ slugs, onRemove, onClear, onCompare }: CompareBarProps) {
  return (
    <div className="compare-bar" data-testid="compare-bar">
      <div className="compare-bar-slots">
        {slugs.map(slug => (
          <div key={slug} className="compare-slot filled">
            <span style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{slug}</span>
            <button
              onClick={() => onRemove(slug)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 0, display: "flex" }}
              data-testid={`compare-remove-${slug}`}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {Array.from({ length: Math.max(0, 2 - slugs.length) }).map((_, i) => (
          <div key={i} className="compare-slot">
            + Add device
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button
          onClick={onClear}
          style={{ background: "var(--bg2)", border: "1px solid var(--border2)", color: "var(--text2)", fontSize: 12, padding: "6px 12px", borderRadius: 4, cursor: "pointer" }}
          data-testid="compare-clear"
        >
          Clear
        </button>
        <button
          onClick={onCompare}
          disabled={slugs.length < 2}
          style={{ background: "var(--blue)", color: "#fff", border: "none", fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: 4, cursor: slugs.length < 2 ? "not-allowed" : "pointer", opacity: slugs.length < 2 ? 0.6 : 1, display: "flex", alignItems: "center", gap: 6 }}
          data-testid="compare-go"
        >
          <GitCompare size={12} />
          Compare ({slugs.length})
        </button>
      </div>
    </div>
  );
}
