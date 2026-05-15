import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, X, GitCompare, Sparkles } from "lucide-react";
import { useCompareProducts, useGetAiVerdict, useSearchAutocomplete, getCompareProductsQueryKey, getSearchAutocompleteQueryKey } from "@workspace/api-client-react";

export default function Compare() {
  const [location] = useLocation();
  const [slugs, setSlugs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] ?? "");
    const s = params.get("slugs");
    if (s) setSlugs(s.split(",").filter(Boolean).slice(0, 4));
  }, [location]);

  const compareParams = { products: slugs };
  const { data: compareData, isLoading } = useCompareProducts(
    compareParams,
    { query: { enabled: slugs.length >= 2, queryKey: getCompareProductsQueryKey(compareParams) } }
  );

  const autocompleteParams = { q: searchQuery };
  const { data: autocompleteData } = useSearchAutocomplete(
    autocompleteParams,
    { query: { enabled: searchQuery.length >= 2, queryKey: getSearchAutocompleteQueryKey(autocompleteParams) } }
  );

  const aiVerdictMutation = useGetAiVerdict();

  const products: any[] = (compareData as any)?.products ?? [];
  const aiVerdict: any = aiVerdictMutation.data ?? null;
  const suggestions: any[] = (autocompleteData as any)?.suggestions ?? [];

  function addProduct(slug: string) {
    if (!slugs.includes(slug) && slugs.length < 4) {
      setSlugs([...slugs, slug]);
    }
    setSearchQuery("");
    setShowAutocomplete(false);
  }

  function removeProduct(slug: string) {
    setSlugs(slugs.filter(s => s !== slug));
  }

  function getAiVerdict() {
    aiVerdictMutation.mutate({ data: { productSlugs: slugs } });
    setShowVerdict(true);
  }

  const allSpecs = products.length > 0
    ? Array.from(new Set(products.flatMap(p => Object.keys(p.specs ?? {}))))
    : [];

  return (
    <div style={{ padding: "0 0 32px" }}>
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="breadcrumb-sep">›</span>
        <span style={{ color: "var(--text2)" }}>Compare</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 700, color: "var(--text)", margin: 0 }}>
          <GitCompare size={18} style={{ display: "inline", marginRight: 8, color: "var(--blue)" }} />
          Compare Phones
        </h1>
        {products.length >= 2 && (
          <button
            onClick={getAiVerdict}
            disabled={aiVerdictMutation.isPending}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "linear-gradient(135deg, #4a9eff, #9d6eff)", color: "#fff", border: "none", borderRadius: 4, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            data-testid="btn-ai-verdict"
          >
            <Sparkles size={14} />
            {aiVerdictMutation.isPending ? "Analyzing..." : "AI Verdict"}
          </button>
        )}
      </div>

      {/* Product Selector */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        {slugs.map(slug => (
          <div key={slug} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg2)", border: "1px solid var(--blue)", borderRadius: 6, padding: "6px 12px" }} data-testid={`compare-chip-${slug}`}>
            <span style={{ fontSize: 13, color: "var(--text)" }}>{slug}</span>
            <button onClick={() => removeProduct(slug)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 0, display: "flex" }} data-testid={`remove-${slug}`}>
              <X size={12} />
            </button>
          </div>
        ))}
        {slugs.length < 4 && (
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--bg2)", border: "1px dashed var(--border2)", borderRadius: 6, padding: "6px 12px" }}>
              <Search size={13} style={{ color: "var(--text3)" }} />
              <input
                type="text"
                placeholder="Add device..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setShowAutocomplete(e.target.value.length >= 2); }}
                style={{ background: "none", border: "none", outline: "none", color: "var(--text)", fontSize: 13, width: 140 }}
                data-testid="compare-search"
              />
            </div>
            {showAutocomplete && suggestions.length > 0 && (
              <div className="autocomplete-dropdown" style={{ top: "calc(100% + 4px)", width: 260 }}>
                {suggestions.map((s: any) => (
                  <div key={s.slug} className="autocomplete-item" onClick={() => addProduct(s.slug)} data-testid={`compare-suggest-${s.slug}`}>
                    {s.imageUrl && <img src={s.imageUrl} alt={s.name} />}
                    <div>
                      <div className="autocomplete-item-name">{s.name}</div>
                      {s.priceFrom && <div className="autocomplete-item-price">₹{Number(s.priceFrom).toLocaleString("en-IN")}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* AI Verdict */}
      {showVerdict && aiVerdict && (
        <div className="ai-verdict" style={{ marginBottom: 20 }} data-testid="ai-verdict">
          <div className="ai-verdict-title">
            <Sparkles size={14} /> AI Recommendation
          </div>
          <p style={{ fontSize: 14, color: "var(--text2)", marginBottom: 12 }}>{aiVerdict.summary}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {aiVerdict.pros?.map((p: any) => (
              <div key={p.slug} style={{ background: "rgba(61,184,122,0.08)", border: "1px solid rgba(61,184,122,0.2)", borderRadius: 6, padding: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", marginBottom: 6 }}>✓ {p.slug}</div>
                {p.points.map((pt: string, i: number) => <div key={i} style={{ fontSize: 12, color: "var(--text2)" }}>• {pt}</div>)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compare Table */}
      {isLoading && (
        <div style={{ textAlign: "center", padding: 40 }}>
          <div className="spinner" style={{ width: 32, height: 32 }} />
        </div>
      )}

      {products.length >= 2 && (
        <div style={{ overflowX: "auto" }}>
          <table className="compare-table" data-testid="compare-table">
            <thead>
              <tr>
                <th style={{ width: 160 }}>Spec</th>
                {products.map((p: any) => (
                  <th key={p.slug} className={aiVerdict?.winner === p.slug ? "compare-winner" : ""}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: 60, height: 60, objectFit: "contain" }} />}
                      <Link href={`/product/${p.slug}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--blue)", textAlign: "center" }}>{p.name}</Link>
                      {aiVerdict?.winner === p.slug && (
                        <span className="badge badge-green">Recommended</span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Price</td>
                {products.map((p: any) => (
                  <td key={p.slug} style={{ fontWeight: 700, color: "var(--green)" }}>
                    {p.priceFrom ? `₹${Number(p.priceFrom).toLocaleString("en-IN")}` : "—"}
                  </td>
                ))}
              </tr>
              <tr>
                <td>Rating</td>
                {products.map((p: any) => (
                  <td key={p.slug}>{p.rating ? `${Number(p.rating).toFixed(1)} / 5` : "—"}</td>
                ))}
              </tr>
              {allSpecs.map(specKey => (
                <tr key={specKey}>
                  <td>{specKey}</td>
                  {products.map((p: any) => (
                    <td key={p.slug}>{p.specs?.[specKey] ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {slugs.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-title">Start comparing</div>
          <p style={{ fontSize: 13, color: "var(--text3)" }}>Search and add 2–4 devices to compare their specs side by side with AI analysis.</p>
        </div>
      )}
    </div>
  );
}
