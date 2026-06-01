import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction) {
  next(new HttpError(404, "Route not found"));
}
