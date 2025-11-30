import { api } from "encore.dev/api";
import db from "../db";

interface Category {
  name: string;
  count: number;
}

interface CategoriesResponse {
  categories: Category[];
}

// Lists all product categories with product counts.
export const categories = api<void, CategoriesResponse>(
  { expose: true, method: "GET", path: "/products/categories" },
  async () => {
    const categories = await db.queryAll<Category>`
      SELECT category as name, COUNT(*) as count
      FROM products
      GROUP BY category
      ORDER BY category
    `;

    return { categories };
  }
);
