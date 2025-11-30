import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";
import type { OrderWithItems } from "./types";

interface CreateOrderRequest {
  discount_code?: string;
}

export const create = api<CreateOrderRequest, OrderWithItems>(
  { auth: true, expose: true, method: "POST", path: "/orders" },
  async ({ discount_code }) => {
    const { userID } = getAuthData()!;
    const cartItems = await db.queryAll<{
      id: number;
      product_id: number;
      quantity: number;
      price: number;
      stock: number;
    }>`
      SELECT c.id, c.product_id, c.quantity, p.price, p.stock_quantity as stock
      FROM cart c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ${userID}
    `;

    if (cartItems.length === 0) {
      throw APIError.invalidArgument("cart is empty");
    }

    // Check stock availability
    for (const item of cartItems) {
      if (item.stock < item.quantity) {
        throw APIError.invalidArgument("insufficient stock for some items");
      }
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = calculateDiscount(total, discount_code);
    const final_amount = total - discount;

    // Start transaction
    const tx = await db.begin();
    try {
      const order = await tx.queryRow<OrderWithItems>`
        INSERT INTO orders (user_id, total, discount, final_amount)
        VALUES (${userID}, ${total}, ${discount}, ${final_amount})
        RETURNING *
      `;

      if (!order) {
        throw APIError.internal("failed to create order");
      }

      // Create order items and update stock
      const items = [];
      for (const item of cartItems) {
        const orderItem = await tx.queryRow<{
          id: number;
          order_id: number;
          product_id: number;
          quantity: number;
          price_at_purchase: number;
        }>`
          INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
          VALUES (${order.id}, ${item.product_id}, ${item.quantity}, ${item.price})
          RETURNING *
        `;
        items.push(orderItem!);

        // Update stock
        await tx.exec`
          UPDATE products 
          SET stock_quantity = stock_quantity - ${item.quantity}
          WHERE id = ${item.product_id}
        `;
      }

      await tx.exec`DELETE FROM cart WHERE user_id = ${userID}`;

      await tx.commit();

      return { ...order, items };
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  }
);

function calculateDiscount(total: number, code?: string): number {
  if (!code) return 0;

  const upperCode = code.toUpperCase();

  // Percentage discounts
  if (upperCode === "SAVE10") return total * 0.1;
  if (upperCode === "SAVE20") return total * 0.2;
  if (upperCode === "SAVE30") return total * 0.3;

  // Fixed amount discounts
  if (upperCode === "FIXED10" && total >= 50) return 10;
  if (upperCode === "FIXED25" && total >= 100) return 25;

  // First time buyer
  if (upperCode === "WELCOME15") return total * 0.15;

  return 0;
}
