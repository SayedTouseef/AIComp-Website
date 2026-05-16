import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteSubnav } from "@/components/layout/SiteSubnav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import Home from "@/pages/Home";
import ProductDetail from "@/pages/ProductDetail";
import Compare from "@/pages/Compare";
import Search from "@/pages/Search";
import CategoryPage from "@/pages/CategoryPage";
import BrandPage from "@/pages/BrandPage";
import BrandsPage from "@/pages/BrandsPage";
import DealsPage from "@/pages/DealsPage";
import LaunchesPage from "@/pages/LaunchesPage";
import GuidesPage from "@/pages/GuidesPage";
import NotFound from "@/pages/not-found";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminBrands from "@/pages/admin/AdminBrands";
import AdminCrawler from "@/pages/admin/AdminCrawler";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <SiteHeader />
      <SiteSubnav />
      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 12px" }}>
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={Dashboard} />
        <Route path="/admin/products" component={AdminProducts} />
        <Route path="/admin/categories" component={AdminCategories} />
        <Route path="/admin/brands" component={AdminBrands} />
        <Route path="/admin/crawler" component={AdminCrawler} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) return <AdminRouter />;

  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/product/:slug" component={ProductDetail} />
        <Route path="/compare" component={Compare} />
        <Route path="/search" component={Search} />
        <Route path="/category/:slug" component={CategoryPage} />
        <Route path="/brand/:slug" component={BrandPage} />
        <Route path="/brands" component={BrandsPage} />
        <Route path="/deals" component={DealsPage} />
        <Route path="/launches" component={LaunchesPage} />
        <Route path="/guides" component={GuidesPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Router />
        <Toaster />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
