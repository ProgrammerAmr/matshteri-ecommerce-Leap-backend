import { api } from "encore.dev/api";
import db from "../db";

interface DashboardMetrics {
  total_revenue: number;
  total_orders: number;
  average_order_value: number;
  total_products: number;
  low_stock_products: number;
  orders_today: number;
  revenue_today: number;
}

// Returns key metrics for the admin dashboard.
export const dashboardMetrics = api<void, DashboardMetrics>(
  { expose: true, method: "GET", path: "/analytics/dashboard" },
  async () => {
    const [revenue, orders, avgOrder, products, lowStock, today] = await Promise.all([
      db.queryRow<{ total: number }>`SELECT COALESCE(SUM(final_amount), 0) as total FROM orders`,
      db.queryRow<{ count: number }>`SELECT COUNT(*) as count FROM orders`,
      db.queryRow<{ avg: number }>`SELECT COALESCE(AVG(final_amount), 0) as avg FROM orders`,
      db.queryRow<{ count: number }>`SELECT COUNT(*) as count FROM products`,
      db.queryRow<{ count: number }>`SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10`,
      db.queryRow<{ orders: number; revenue: number }>`
        SELECT 
          COUNT(*) as orders,
          COALESCE(SUM(final_amount), 0) as revenue
        FROM orders
        WHERE DATE(order_date) = CURRENT_DATE
      `,
    ]);

    return {
      total_revenue: revenue?.total || 0,
      total_orders: orders?.count || 0,
      average_order_value: avgOrder?.avg || 0,
      total_products: products?.count || 0,
      low_stock_products: lowStock?.count || 0,
      orders_today: today?.orders || 0,
      revenue_today: today?.revenue || 0,
    };
  }
);
