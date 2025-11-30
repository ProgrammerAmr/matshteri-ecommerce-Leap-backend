import { api } from "encore.dev/api";
import db from "../db";

interface SalesTrend {
  date: string;
  orders: number;
  revenue: number;
}

interface SalesTrendsRequest {
  days?: number;
}

interface SalesTrendsResponse {
  trends: SalesTrend[];
}

// Returns sales trends over the specified number of days.
export const salesTrends = api<SalesTrendsRequest, SalesTrendsResponse>(
  { expose: true, method: "GET", path: "/analytics/sales-trends" },
  async ({ days = 30 }) => {
    const trends = await db.rawQueryAll<SalesTrend>(
      `
      SELECT 
        DATE(order_date) as date,
        COUNT(*) as orders,
        SUM(final_amount) as revenue
      FROM orders
      WHERE order_date >= NOW() - INTERVAL '${days} days'
      GROUP BY DATE(order_date)
      ORDER BY date DESC
    `
    );

    return { trends };
  }
);
