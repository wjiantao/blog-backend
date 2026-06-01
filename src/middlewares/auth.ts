import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { HttpError } from "../utils/http-error";

export function requireAdmin(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new HttpError(401, "Missing bearer token");
  }

  const token = authHeader.replace("Bearer ", "").trim();
  const payload = verifyAccessToken(token);

  if (payload.role !== "admin") {
    throw new HttpError(403, "Forbidden");
  }

  req.user = payload;
  next();
}
