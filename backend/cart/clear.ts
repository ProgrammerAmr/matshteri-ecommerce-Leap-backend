import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import db from "../db";

export const clear = api<void, void>(
  { auth: true, expose: true, method: "DELETE", path: "/cart/clear" },
  async () => {
    const { userID } = getAuthData()!;
    await db.exec`DELETE FROM cart WHERE user_id = ${userID}`;
  }
);
