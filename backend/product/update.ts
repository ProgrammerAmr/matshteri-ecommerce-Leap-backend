import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Product } from "./types";

interface UpdateProductRequest {
  id: number;
  name?: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price?: number;
  category?: string;
  stock_quantity?: number;
  image_url?: string;
}

// Updates an existing product.
export const update = api<UpdateProductRequest, Product>(
  { expose: true, method: "PUT", path: "/products/:id" },
  async ({ id, ...updates }) => {
    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        paramCount++;
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
      }
    });

    if (fields.length === 0) {
      const product = await db.queryRow<Product>`SELECT * FROM products WHERE id = ${id}`;
      if (!product) {
        throw APIError.notFound("product not found");
      }
      return product;
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE products
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const product = await db.rawQueryRow<Product>(query, ...values);

    if (!product) {
      throw APIError.notFound("product not found");
    }

    return product;
  }
);
