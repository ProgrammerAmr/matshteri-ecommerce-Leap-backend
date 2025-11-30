import { Link } from "react-router-dom";
import { ShoppingCart, Package, LayoutDashboard, Home, Moon, Sun, Languages, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./theme-provider";
import { useI18n } from "../lib/i18n-context";
import { useBackend } from "../lib/use-backend";
import { useAuth } from "@clerk/clerk-react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useI18n();
  const backend = useBackend();
  const { isSignedIn } = useAuth();

  const { data: cart } = useQuery({
    queryKey: ["cart"],
    queryFn: () => backend.cart.get(),
    enabled: isSignedIn,
  });

  const cartItemCount = cart?.items.length || 0;

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform transition-transform group-hover:scale-110">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("site.title")}
              </h1>
              <p className="text-xs text-muted-foreground">{t("site.tagline")}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              <Home className="w-4 h-4 inline-block me-1" />
              {t("nav.home")}
            </Link>
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
              <Package className="w-4 h-4 inline-block me-1" />
              {t("nav.products")}
            </Link>
            <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">
              <Package className="w-4 h-4 inline-block me-1" />
              {t("nav.orders")}
            </Link>
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">
              <LayoutDashboard className="w-4 h-4 inline-block me-1" />
              {t("nav.admin")}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="hover:bg-accent"
            >
              <Languages className="w-5 h-5" />
            </Button>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="hover:bg-accent">
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            <SignedIn>
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative hover:bg-accent">
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -end-1 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <User className="w-4 h-4 me-2" />
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
