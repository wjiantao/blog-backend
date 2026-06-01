import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

export function validateRequest(schema: ZodTypeAny) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {},
    });

    if (!result.success) {
      const message = result.error.issues
        .map((item) => {
          const fieldPath = item.path.length > 0 ? item.path.join(".") : "request";
          return `${fieldPath}: ${item.message}`;
        })
        .join("; ");
      return next(new Error(message));
    }

    // Express 5 的 req.query 是只读 getter，这里仅做校验，不回写 req 对象
    return next();
  };
}
