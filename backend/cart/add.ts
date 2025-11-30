import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { CartItem } from "./types";

interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export const add = api<AddToCartRequest, CartItem>(
  { auth: true, expose: true, method: "POST", path: "/cart" },
  async ({ product_id, quantity }) => {
    const { userID } = getAuthData()!;
    // Check if product exists and has stock
    const product = await db.queryRow<{ stock_quantity: number }>`
      SELECT stock_quantity FROM products WHERE id = ${product_id}
    `;

    if (!product) {
      throw APIError.notFound("product not found");
    }

    if (product.stock_quantity < quantity) {
      throw APIError.invalidArgument("insufficient stock");
    }

    const existing = await db.queryRow<{ id: number; quantity: number }>`
      SELECT id, quantity FROM cart WHERE user_id = ${userID} AND product_id = ${product_id}
    `;

    if (existing) {
      const newQuantity = existing.quantity + quantity;
      if (product.stock_quantity < newQuantity) {
        throw APIError.invalidArgument("insufficient stock");
      }

      const updated = await db.queryRow<CartItem>`
        UPDATE cart SET quantity = ${newQuantity}
        WHERE id = ${existing.id}
        RETURNING id, user_id, product_id, quantity, added_at,
          (SELECT name FROM products WHERE id = product_id) as product_name,
          (SELECT name_ar FROM products WHERE id = product_id) as product_name_ar,
          (SELECT price FROM products WHERE id = product_id) as product_price,
          (SELECT image_url FROM products WHERE id = product_id) as product_image_url,
          (SELECT stock_quantity FROM products WHERE id = product_id) as product_stock
      `;
      return updated!;
    }

    const item = await db.queryRow<CartItem>`
      INSERT INTO cart (user_id, product_id, quantity)
      VALUES (${userID}, ${product_id}, ${quantity})
      RETURNING id, user_id, product_id, quantity, added_at,
        (SELECT name FROM products WHERE id = product_id) as product_name,
        (SELECT name_ar FROM products WHERE id = product_id) as product_name_ar,
        (SELECT price FROM products WHERE id = product_id) as product_price,
        (SELECT image_url FROM products WHERE id = product_id) as product_image_url,
        (SELECT stock_quantity FROM products WHERE id = product_id) as product_stock
    `;

    return item!;
  }
);
