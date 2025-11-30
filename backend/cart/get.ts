import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { CartItem } from "./types";

interface GetCartResponse {
  items: CartItem[];
  total: number;
}

export const get = api<void, GetCartResponse>(
  { auth: true, expose: true, method: "GET", path: "/cart" },
  async () => {
    const { userID } = getAuthData()!;
    const items = await db.queryAll<CartItem>`
      SELECT 
        c.id, c.user_id, c.product_id, c.quantity, c.added_at,
        p.name as product_name, p.name_ar as product_name_ar, p.price as product_price, 
        p.image_url as product_image_url, p.stock_quantity as product_stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ${userID}
      ORDER BY c.added_at DESC
    `;

    const total = items.reduce((sum, item) => sum + item.product_price * item.quantity, 0);

    return { items, total };
  }
);
