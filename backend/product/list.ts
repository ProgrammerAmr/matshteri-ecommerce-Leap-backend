import { api } from "encore.dev/api";
import db from "../db";
import type { Product } from "./types";

interface ListProductsRequest {
  category?: string;
  search?: string;
  sort?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest";
  limit?: number;
  offset?: number;
}

interface ListProductsResponse {
  products: Product[];
  total: number;
}

// Lists all products with optional filtering and sorting.
export const list = api<ListProductsRequest, ListProductsResponse>(
  { expose: true, method: "GET", path: "/products" },
  async ({ category, search, sort = "newest", limit = 50, offset = 0 }) => {
    let query = "SELECT * FROM products WHERE 1=1";
    const params: any[] = [];
    let paramCount = 0;

    if (category) {
      paramCount++;
      query += ` AND category = $${paramCount}`;
      params.push(category);
    }

    if (search) {
      paramCount++;
      query += ` AND (name ILIKE $${paramCount} OR description ILIKE $${paramCount})`;
      params.push(`%${search}%`);
    }

    // Add sorting
    switch (sort) {
      case "price_asc":
        query += " ORDER BY price ASC";
        break;
      case "price_desc":
        query += " ORDER BY price DESC";
        break;
      case "name_asc":
        query += " ORDER BY name ASC";
        break;
      case "name_desc":
        query += " ORDER BY name DESC";
        break;
      case "newest":
      default:
        query += " ORDER BY created_at DESC";
        break;
    }

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    params.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    params.push(offset);

    const products = await db.rawQueryAll<Product>(query, ...params);

    // Get total count
    let countQuery = "SELECT COUNT(*) as count FROM products WHERE 1=1";
    const countParams: any[] = [];
    let countParamCount = 0;

    if (category) {
      countParamCount++;
      countQuery += ` AND category = $${countParamCount}`;
      countParams.push(category);
    }

    if (search) {
      countParamCount++;
      countQuery += ` AND (name ILIKE $${countParamCount} OR description ILIKE $${countParamCount})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await db.rawQueryRow<{ count: number }>(countQuery, ...countParams);
    const total = countResult?.count || 0;

    return { products, total };
  }
);
