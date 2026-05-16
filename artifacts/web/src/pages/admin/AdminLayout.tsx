import { Link, useLocation } from "wouter";
import { LayoutDashboard, Package, Tag, Award, Radio, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/brands", label: "Brands", icon: Award },
  { href: "/admin/crawler", label: "Crawler", icon: Radio },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
        />
      )}

      <aside style={{
        width: 220, minHeight: "100vh", background: "var(--nav-bg)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: sidebarOpen ? 0 : -220,
        zIndex: 50, transition: "left .2s",
      }}>
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 18, color: "var(--blue)" }}>AIComp</span>
          <span style={{ fontSize: 11, background: "var(--orange)", color: "#fff", borderRadius: 4, padding: "2px 6px", fontWeight: 600 }}>ADMIN</span>
        </div>
        <nav style={{ flex: 1, padding: "12px 0" }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? location === "/admin" : location.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 20px", cursor: "pointer",
                  color: active ? "var(--blue)" : "var(--text-muted)",
                  background: active ? "rgba(74,158,255,0.08)" : "transparent",
                  borderLeft: active ? "3px solid var(--blue)" : "3px solid transparent",
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  textDecoration: "none",
                  transition: "all .15s",
                }}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-muted)", fontSize: 13, textDecoration: "none" }}>
            <LogOut size={14} /> Back to Site
          </Link>
        </div>
      </aside>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", marginLeft: 0 }}>
        <header style={{
          background: "var(--nav-bg)", borderBottom: "1px solid var(--border)",
          padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 16,
          position: "sticky", top: 0, zIndex: 30,
        }}>
          <button
            onClick={() => setSidebarOpen(v => !v)}
            style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: 4 }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>
            {NAV.find(n => n.href === "/admin" ? location === "/admin" : location.startsWith(n.href))?.label ?? "Admin"}
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, background: "var(--green)", color: "#fff", borderRadius: 20, padding: "2px 10px", fontWeight: 600 }}>Live</span>
          </div>
        </header>
        <main style={{ flex: 1, padding: "28px 24px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
