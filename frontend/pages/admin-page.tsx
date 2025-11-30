import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "../lib/i18n-context";
import backend from "~backend/client";

export function AdminPage() {
  const { t } = useI18n();

  const { data: metrics } = useQuery({
    queryKey: ["admin-metrics"],
    queryFn: () => backend.analytics.dashboardMetrics(),
  });

  const { data: bestSellers } = useQuery({
    queryKey: ["best-sellers"],
    queryFn: () => backend.analytics.bestSellers(),
  });

  const { data: categoryPerformance } = useQuery({
    queryKey: ["category-performance"],
    queryFn: () => backend.analytics.categoryPerformance(),
  });

  const { data: salesTrends } = useQuery({
    queryKey: ["sales-trends"],
    queryFn: () => backend.analytics.salesTrends({ days: 7 }),
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        {t("admin.title")}
      </h1>

      {/* Metrics Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.totalRevenue")}</CardTitle>
            <DollarSign className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics?.total_revenue.toFixed(2) || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-pink-500/10 to-transparent border-pink-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.totalOrders")}</CardTitle>
            <ShoppingCart className="w-4 h-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.total_orders || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.avgOrderValue")}</CardTitle>
            <TrendingUp className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics?.average_order_value.toFixed(2) || 0}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t("admin.ordersToday")}</CardTitle>
            <Package className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.orders_today || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ${metrics?.revenue_today.toFixed(2) || 0} revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.bestSellers")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bestSellers?.products.slice(0, 5).map((product, index) => (
                <div key={product.product_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{product.product_name}</p>
                      <p className="text-sm text-muted-foreground">{product.total_sold} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold">${product.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("admin.categoryPerformance")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryPerformance?.categories.map((category) => (
                <div key={category.category}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{category.category}</span>
                    <span className="text-sm text-muted-foreground">
                      ${category.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{
                        width: `${
                          (category.revenue /
                            Math.max(...(categoryPerformance?.categories.map((c) => c.revenue) || [1]))) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("admin.salesTrends")} (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {salesTrends?.trends.map((trend) => (
                <div key={trend.date} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{new Date(trend.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{trend.orders} orders</span>
                    <span className="font-semibold">${trend.revenue.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
