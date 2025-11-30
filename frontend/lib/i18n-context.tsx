import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "en" | "ar";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translations = {
  en: {
    "site.title": "Mateshtri",
    "site.tagline": "Shop Smart, Shop Fast",
    "nav.home": "Home",
    "nav.products": "Products",
    "nav.cart": "Cart",
    "nav.orders": "Orders",
    "nav.admin": "Admin",
    "hero.title": "Welcome to Mateshtri",
    "hero.subtitle": "Your one-stop shop for quality products",
    "hero.cta": "Shop Now",
    "products.title": "Our Products",
    "products.search": "Search products...",
    "products.sort": "Sort by",
    "products.filter": "Filter by category",
    "products.all": "All Categories",
    "products.addToCart": "Add to Cart",
    "products.outOfStock": "Out of Stock",
    "cart.title": "Shopping Cart",
    "cart.empty": "Your cart is empty",
    "cart.continueShopping": "Continue Shopping",
    "cart.checkout": "Proceed to Checkout",
    "cart.total": "Total",
    "cart.remove": "Remove",
    "checkout.title": "Checkout",
    "checkout.discount": "Discount Code",
    "checkout.apply": "Apply",
    "checkout.placeOrder": "Place Order",
    "orders.title": "My Orders",
    "orders.orderNumber": "Order #",
    "orders.date": "Date",
    "orders.total": "Total",
    "orders.items": "Items",
    "admin.title": "Admin Dashboard",
    "admin.metrics": "Key Metrics",
    "admin.totalRevenue": "Total Revenue",
    "admin.totalOrders": "Total Orders",
    "admin.avgOrderValue": "Avg Order Value",
    "admin.ordersToday": "Orders Today",
    "admin.bestSellers": "Best Selling Products",
    "admin.salesTrends": "Sales Trends",
    "admin.categoryPerformance": "Category Performance",
    "sort.newest": "Newest",
    "sort.priceAsc": "Price: Low to High",
    "sort.priceDesc": "Price: High to Low",
    "sort.nameAsc": "Name: A-Z",
    "sort.nameDesc": "Name: Z-A",
  },
  ar: {
    "site.title": "ماتشترى",
    "site.tagline": "تسوق بذكاء، تسوق بسرعة",
    "nav.home": "الرئيسية",
    "nav.products": "المنتجات",
    "nav.cart": "السلة",
    "nav.orders": "الطلبات",
    "nav.admin": "الإدارة",
    "hero.title": "مرحباً بك في ماتشترى",
    "hero.subtitle": "متجرك الشامل للمنتجات عالية الجودة",
    "hero.cta": "تسوق الآن",
    "products.title": "منتجاتنا",
    "products.search": "ابحث عن منتجات...",
    "products.sort": "ترتيب حسب",
    "products.filter": "تصفية حسب الفئة",
    "products.all": "جميع الفئات",
    "products.addToCart": "إضافة إلى السلة",
    "products.outOfStock": "غير متوفر",
    "cart.title": "سلة التسوق",
    "cart.empty": "سلتك فارغة",
    "cart.continueShopping": "متابعة التسوق",
    "cart.checkout": "إتمام الطلب",
    "cart.total": "الإجمالي",
    "cart.remove": "إزالة",
    "checkout.title": "إتمام الطلب",
    "checkout.discount": "كود الخصم",
    "checkout.apply": "تطبيق",
    "checkout.placeOrder": "تأكيد الطلب",
    "orders.title": "طلباتي",
    "orders.orderNumber": "رقم الطلب",
    "orders.date": "التاريخ",
    "orders.total": "الإجمالي",
    "orders.items": "العناصر",
    "admin.title": "لوحة التحكم",
    "admin.metrics": "المؤشرات الرئيسية",
    "admin.totalRevenue": "إجمالي الإيرادات",
    "admin.totalOrders": "إجمالي الطلبات",
    "admin.avgOrderValue": "متوسط قيمة الطلب",
    "admin.ordersToday": "طلبات اليوم",
    "admin.bestSellers": "الأكثر مبيعاً",
    "admin.salesTrends": "اتجاهات المبيعات",
    "admin.categoryPerformance": "أداء الفئات",
    "sort.newest": "الأحدث",
    "sort.priceAsc": "السعر: من الأقل للأعلى",
    "sort.priceDesc": "السعر: من الأعلى للأقل",
    "sort.nameAsc": "الاسم: أ-ي",
    "sort.nameDesc": "الاسم: ي-أ",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  };

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t,
        isRTL: language === "ar",
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
