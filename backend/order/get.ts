import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { OrderWithItems, OrderItem } from "./types";

export const get = api<{ id: number }, OrderWithItems>(
  { auth: true, expose: true, method: "GET", path: "/orders/:id/details" },
  async ({ id }) => {
    const { userID } = getAuthData()!;
    const order = await db.queryRow<OrderWithItems>`
      SELECT * FROM orders WHERE id = ${id} AND user_id = ${userID}
    `;

    if (!order) {
      throw APIError.notFound("order not found");
    }

    const items = await db.queryAll<OrderItem>`
      SELECT 
        oi.*,
        p.name as product_name,
        p.name_ar as product_name_ar
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ${id}
    `;

    return { ...order, items };
  }
);
