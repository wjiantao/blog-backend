import jwt from "jsonwebtoken";
import { env } from "../config/env";

export type AuthPayload = {
  userId: number;
  username: string;
  role: "admin";
};

export function signAccessToken(payload: AuthPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AuthPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthPayload;
}
