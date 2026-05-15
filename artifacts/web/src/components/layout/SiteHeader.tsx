import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, GitCompare, Menu, X, Smartphone } from "lucide-react";
import { useSearchAutocomplete, getSearchAutocompleteQueryKey } from "@workspace/api-client-react";

export function SiteHeader() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  const debouncedQuery = useDebounce(query, 250);
  const autocompleteParams = { q: debouncedQuery };
  const { data: autocomplete } = useSearchAutocomplete(
    autocompleteParams,
    { query: { enabled: debouncedQuery.length >= 2, queryKey: getSearchAutocompleteQueryKey(autocompleteParams) } }
  );

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  function handleSelect(slug: string) {
    navigate(`/product/${slug}`);
    setOpen(false);
    setQuery("");
  }

  const suggestions = (autocomplete as any)?.suggestions ?? [];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo" data-testid="logo">
          AI<span>Comp</span>
        </Link>

        <form className="header-search" onSubmit={handleSubmit} ref={dropdownRef as any}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search phones, tablets, laptops..."
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(e.target.value.length >= 2); }}
            onFocus={() => query.length >= 2 && setOpen(true)}
            data-testid="search-input"
            autoComplete="off"
          />
          <button type="submit" style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text3)", display: "flex" }}>
            <Search size={16} />
          </button>

          {open && suggestions.length > 0 && (
            <div className="autocomplete-dropdown">
              {suggestions.map((s: any) => (
                <div
                  key={s.slug}
                  className="autocomplete-item"
                  onClick={() => handleSelect(s.slug)}
                  data-testid={`autocomplete-item-${s.slug}`}
                >
                  {s.imageUrl && <img src={s.imageUrl} alt={s.name} />}
                  <div>
                    <div className="autocomplete-item-name">{s.name}</div>
                    {s.priceFrom && (
                      <div className="autocomplete-item-price">From ₹{Number(s.priceFrom).toLocaleString("en-IN")}</div>
                    )}
                  </div>
                </div>
              ))}
              <div
                className="autocomplete-item"
                style={{ borderTop: "1px solid var(--border)", color: "var(--blue)", fontSize: 12 }}
                onClick={() => { navigate(`/search?q=${encodeURIComponent(query)}`); setOpen(false); }}
              >
                <Search size={14} />
                <span>See all results for "{query}"</span>
              </div>
            </div>
          )}
        </form>

        <nav className="header-nav">
          <Link href="/compare" data-testid="nav-compare">
            <GitCompare size={14} style={{ display: "inline", marginRight: 4 }} />
            Compare
          </Link>
          <Link href="/deals" data-testid="nav-deals">Deals</Link>
          <Link href="/launches" data-testid="nav-launches">Upcoming</Link>
          <Link href="/guides" data-testid="nav-guides">Guides</Link>
        </nav>

        <button
          className="header-menu-btn"
          onClick={() => setMobileMenu(!mobileMenu)}
          style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", display: "none" }}
          data-testid="mobile-menu-btn"
        >
          {mobileMenu ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenu && (
        <div style={{ background: "var(--nav-bg)", borderTop: "1px solid var(--border)", padding: "8px 16px" }}>
          <Link href="/compare" style={{ display: "block", padding: "8px 0", color: "var(--text2)", fontSize: 13 }} onClick={() => setMobileMenu(false)}>Compare</Link>
          <Link href="/deals" style={{ display: "block", padding: "8px 0", color: "var(--text2)", fontSize: 13 }} onClick={() => setMobileMenu(false)}>Deals</Link>
          <Link href="/launches" style={{ display: "block", padding: "8px 0", color: "var(--text2)", fontSize: 13 }} onClick={() => setMobileMenu(false)}>Upcoming</Link>
          <Link href="/guides" style={{ display: "block", padding: "8px 0", color: "var(--text2)", fontSize: 13 }} onClick={() => setMobileMenu(false)}>Guides</Link>
        </div>
      )}
    </header>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
