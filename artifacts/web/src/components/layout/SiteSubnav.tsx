import { Link, useLocation } from "wouter";
import { useListCategories } from "@workspace/api-client-react";
import { Smartphone, Laptop, Headphones, Watch, Camera, Tablet, Tv, Cpu } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  smartphones: <Smartphone size={12} />,
  laptops: <Laptop size={12} />,
  audio: <Headphones size={12} />,
  wearables: <Watch size={12} />,
  cameras: <Camera size={12} />,
  tablets: <Tablet size={12} />,
  televisions: <Tv size={12} />,
  components: <Cpu size={12} />,
};

export function SiteSubnav() {
  const [location] = useLocation();
  const { data } = useListCategories();
  const categories = (data as any)?.data ?? [];

  return (
    <nav className="site-subnav">
      <div className="site-subnav-inner">
        <Link
          href="/"
          className={`subnav-item${location === "/" ? " active" : ""}`}
          data-testid="subnav-home"
        >
          Home
        </Link>
        {categories.slice(0, 10).map((cat: any) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className={`subnav-item${location === `/category/${cat.slug}` ? " active" : ""}`}
            data-testid={`subnav-${cat.slug}`}
          >
            {ICON_MAP[cat.slug] && (
              <span style={{ marginRight: 4, verticalAlign: "middle" }}>{ICON_MAP[cat.slug]}</span>
            )}
            {cat.name}
          </Link>
        ))}
        <Link
          href="/brands"
          className={`subnav-item${location === "/brands" ? " active" : ""}`}
          data-testid="subnav-brands"
        >
          Brands
        </Link>
      </div>
    </nav>
  );
}
