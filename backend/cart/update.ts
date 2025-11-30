import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { CartItem } from "./types";

interface UpdateCartItemRequest {
  id: number;
  quantity: number;
}

export const update = api<UpdateCartItemRequest, CartItem>(
  { auth: true, expose: true, method: "PUT", path: "/cart/:id" },
  async ({ id, quantity }) => {
    const { userID } = getAuthData()!;
    if (quantity <= 0) {
      throw APIError.invalidArgument("quantity must be positive");
    }

    const cartItem = await db.queryRow<{ product_id: number }>`
      SELECT product_id FROM cart WHERE id = ${id} AND user_id = ${userID}
    `;

    if (!cartItem) {
      throw APIError.notFound("cart item not found");
    }

    const product = await db.queryRow<{ stock_quantity: number }>`
      SELECT stock_quantity FROM products WHERE id = ${cartItem.product_id}
    `;

    if (!product || product.stock_quantity < quantity) {
      throw APIError.invalidArgument("insufficient stock");
    }

    const updated = await db.queryRow<CartItem>`
      UPDATE cart SET quantity = ${quantity}
      WHERE id = ${id}
      RETURNING id, user_id, product_id, quantity, added_at,
        (SELECT name FROM products WHERE id = product_id) as product_name,
        (SELECT name_ar FROM products WHERE id = product_id) as product_name_ar,
        (SELECT price FROM products WHERE id = product_id) as product_price,
        (SELECT image_url FROM products WHERE id = product_id) as product_image_url,
        (SELECT stock_quantity FROM products WHERE id = product_id) as product_stock
    `;

    return updated!;
  }
);
