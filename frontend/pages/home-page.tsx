import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "../lib/i18n-context";

export function HomePage() {
  const { t } = useI18n();

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent animate-fade-in">
            {t("hero.title")}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delay-1">
            {t("hero.subtitle")}
          </p>
          <Link to="/products">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg animate-fade-in-delay-2"
            >
              {t("hero.cta")}
              <ArrowRight className="ms-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-8 py-16">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/20 hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
            <Zap className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-muted-foreground">Get your orders delivered quickly and efficiently</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent border border-pink-500/20 hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-pink-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
          <p className="text-muted-foreground">Your transactions are safe and encrypted</p>
        </div>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 hover:scale-105 transition-transform">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
            <Truck className="w-6 h-6 text-orange-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
          <p className="text-muted-foreground">Enjoy free shipping on orders over $50</p>
        </div>
      </section>
    </div>
  );
}
