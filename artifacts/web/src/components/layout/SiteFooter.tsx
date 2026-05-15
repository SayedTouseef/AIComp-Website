import { Link } from "wouter";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-col-title">AIComp</div>
            <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.6, marginBottom: 8 }}>
              India's smartest electronics comparison platform. AI-powered reviews and real-time price tracking.
            </p>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Explore</div>
            <Link href="/category/smartphones">Smartphones</Link>
            <Link href="/category/laptops">Laptops</Link>
            <Link href="/category/tablets">Tablets</Link>
            <Link href="/category/wearables">Wearables</Link>
            <Link href="/category/audio">Audio</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Tools</div>
            <Link href="/compare">Compare Phones</Link>
            <Link href="/deals">Best Deals</Link>
            <Link href="/launches">Upcoming Phones</Link>
            <Link href="/guides">Buying Guides</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-title">Company</div>
            <a href="#">About AIComp</a>
            <a href="#">Advertise</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AIComp.in — All rights reserved</span>
          <span>Made in India 🇮🇳 | Data updated daily</span>
        </div>
      </div>
    </footer>
  );
}
