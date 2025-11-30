import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "./components/theme-provider";
import { I18nProvider } from "./lib/i18n-context";
import { Header } from "./components/header";
import { HomePage } from "./pages/home-page";
import { ProductsPage } from "./pages/products-page";
import { CartPage } from "./pages/cart-page";
import { CheckoutPage } from "./pages/checkout-page";
import { OrdersPage } from "./pages/orders-page";
import { AdminPage } from "./pages/admin-page";

const PUBLISHABLE_KEY = "pk_test_aW1tdW5lLW1vY2Nhc2luLTYuY2xlcmsuYWNjb3VudHMuZGV2JA";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark">
          <I18nProvider>
            <BrowserRouter>
              <div className="min-h-screen bg-background">
                <Header />
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <Toaster />
              </div>
            </BrowserRouter>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
