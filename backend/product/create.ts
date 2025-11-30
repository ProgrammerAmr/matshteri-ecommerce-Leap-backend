import { api } from "encore.dev/api";
import db from "../db";
import type { Product } from "./types";

interface CreateProductRequest {
  name: string;
  name_ar?: string;
  description?: string;
  description_ar?: string;
  price: number;
  category: string;
  stock_quantity: number;
  image_url?: string;
}

// Creates a new product.
export const create = api<CreateProductRequest, Product>(
  { expose: true, method: "POST", path: "/products" },
  async (req) => {
    const product = await db.queryRow<Product>`
      INSERT INTO products (name, name_ar, description, description_ar, price, category, stock_quantity, image_url)
      VALUES (${req.name}, ${req.name_ar}, ${req.description}, ${req.description_ar}, ${req.price}, ${req.category}, ${req.stock_quantity}, ${req.image_url})
      RETURNING *
    `;

    return product!;
  }
);
