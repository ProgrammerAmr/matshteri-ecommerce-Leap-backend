import { api } from "encore.dev/api";
import db from "../db";

interface CategoryPerformance {
  category: string;
  total_sold: number;
  revenue: number;
}

interface CategoryPerformanceResponse {
  categories: CategoryPerformance[];
}

// Returns performance metrics by product category.
export const categoryPerformance = api<void, CategoryPerformanceResponse>(
  { expose: true, method: "GET", path: "/analytics/category-performance" },
  async () => {
    const categories = await db.queryAll<CategoryPerformance>`
      SELECT 
        p.category,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price_at_purchase) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.category
      ORDER BY revenue DESC
    `;

    return { categories };
  }
);
