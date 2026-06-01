import { Router } from "express";
import { postController } from "../controllers/post.controller";
import { requireAdmin } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validate";
import {
  adminPostListQuerySchema,
  createPostSchema,
  postByIdSchema,
  postBySlugSchema,
  publicPostsQuerySchema,
  updatePostSchema,
} from "../schemas/post.schema";

export const postRouter = Router();

postRouter.get("/posts", validateRequest(publicPostsQuerySchema), postController.listPublic);
postRouter.get("/posts/:slug", validateRequest(postBySlugSchema), postController.getPublicBySlug);

postRouter.get("/admin/posts", requireAdmin, validateRequest(adminPostListQuerySchema), postController.listAdmin);
postRouter.get("/admin/posts/:id", requireAdmin, validateRequest(postByIdSchema), postController.getAdminById);
postRouter.post("/admin/posts", requireAdmin, validateRequest(createPostSchema), postController.create);
postRouter.put("/admin/posts/:id", requireAdmin, validateRequest(updatePostSchema), postController.update);
postRouter.delete("/admin/posts/:id", requireAdmin, validateRequest(postByIdSchema), postController.delete);
