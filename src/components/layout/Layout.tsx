import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Theme = "light" | "dark";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const router = useRouter();
  const isProducts =
    router.pathname === "/products" || router.pathname === "/";
  const isAdjustments = router.pathname === "/adjustments";

  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("app-theme") as Theme | null;
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        document.documentElement.dataset.theme = saved;
        return;
      }

      const prefersDark = window.matchMedia?.(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initial: Theme = prefersDark ? "dark" : "light";
      setTheme(initial);
      document.documentElement.dataset.theme = initial;
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("app-theme", theme);
    } catch {
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-brand">
            <div className="app-brand-avatar">IN</div>
            <div className="app-brand-text">
              <div className="app-brand-title">Inventory Console</div>
              <div className="app-brand-subtitle">
                Products &amp; stock adjustments overview
              </div>
            </div>
          </div>

          <div className="app-header-right">
            <nav className="app-nav">
              <Link
                href="/products"
                className={
                  "app-nav-link" + (isProducts ? " app-nav-link--active" : "")
                }
              >
                Products
              </Link>
              <Link
                href="/adjustments"
                className={
                  "app-nav-link" +
                  (isAdjustments ? " app-nav-link--active" : "")
                }
              >
                Adjustments
              </Link>
            </nav>

            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">{children}</main>
    </div>
  );
}