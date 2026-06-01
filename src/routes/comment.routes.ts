import { Router } from "express";
import { commentController } from "../controllers/comment.controller";
import { requireAdmin } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validate";
import { adminCommentsQuerySchema, createCommentSchema, updateCommentStatusSchema } from "../schemas/comment.schema";

export const commentRouter = Router();

commentRouter.post("/comments", validateRequest(createCommentSchema), commentController.create);
commentRouter.get("/admin/comments", requireAdmin, validateRequest(adminCommentsQuerySchema), commentController.listAdmin);
commentRouter.patch("/admin/comments/:id/status", requireAdmin, validateRequest(updateCommentStatusSchema), commentController.updateStatus);
