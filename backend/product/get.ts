import { api, APIError } from "encore.dev/api";
import db from "../db";
import type { Product } from "./types";

// Retrieves a single product by ID.
export const get = api<{ id: number }, Product>(
  { expose: true, method: "GET", path: "/products/:id" },
  async ({ id }) => {
    const product = await db.queryRow<Product>`
      SELECT * FROM products WHERE id = ${id}
    `;

    if (!product) {
      throw APIError.notFound("product not found");
    }

    return product;
  }
);
