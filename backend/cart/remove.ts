import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export const remove = api<{ id: number }, void>(
  { auth: true, expose: true, method: "DELETE", path: "/cart/:id" },
  async ({ id }) => {
    const { userID } = getAuthData()!;
    await db.exec`DELETE FROM cart WHERE id = ${id} AND user_id = ${userID}`;
  }
);
