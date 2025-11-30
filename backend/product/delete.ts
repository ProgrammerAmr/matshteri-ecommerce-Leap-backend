import { api } from "encore.dev/api";
import db from "../db";

// Deletes a product.
export const deleteProduct = api<{ id: number }, void>(
  { expose: true, method: "DELETE", path: "/products/:id" },
  async ({ id }) => {
    await db.exec`DELETE FROM products WHERE id = ${id}`;
  }
);
