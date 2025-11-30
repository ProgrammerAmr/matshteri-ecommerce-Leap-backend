import { api } from "encore.dev/api";
import db from "../db";

interface BestSellerProduct {
  product_id: number;
  product_name: string;
  product_name_ar?: string;
  total_sold: number;
  revenue: number;
}

interface BestSellersResponse {
  products: BestSellerProduct[];
}

// Returns the top 10 best-selling products.
export const bestSellers = api<void, BestSellersResponse>(
  { expose: true, method: "GET", path: "/analytics/best-sellers" },
  async () => {
    const products = await db.queryAll<BestSellerProduct>`
      SELECT 
        oi.product_id,
        p.name as product_name,
        p.name_ar as product_name_ar,
        SUM(oi.quantity) as total_sold,
        SUM(oi.quantity * oi.price_at_purchase) as revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY oi.product_id, p.name, p.name_ar
      ORDER BY total_sold DESC
      LIMIT 10
    `;

    return { products };
  }
);
