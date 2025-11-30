import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { Order } from "./types";

interface ListOrdersRequest {
  limit?: number;
  offset?: number;
}

interface ListOrdersResponse {
  orders: Order[];
  total: number;
}

export const list = api<ListOrdersRequest, ListOrdersResponse>(
  { auth: true, expose: true, method: "GET", path: "/orders" },
  async ({ limit = 50, offset = 0 }) => {
    const { userID } = getAuthData()!;
    const orders = await db.queryAll<Order>`
      SELECT * FROM orders
      WHERE user_id = ${userID}
      ORDER BY order_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await db.queryRow<{ count: number }>`
      SELECT COUNT(*) as count FROM orders WHERE user_id = ${userID}
    `;
    const total = countResult?.count || 0;

    return { orders, total };
  }
);
