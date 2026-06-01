import { Router } from "express";
import { taxonomyController } from "../controllers/taxonomy.controller";
import { requireAdmin } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validate";
import {
  categoryByIdSchema,
  createCategorySchema,
  createTagSchema,
  tagByIdSchema,
  updateCategorySchema,
  updateTagSchema,
} from "../schemas/taxonomy.schema";

export const taxonomyRouter = Router();

taxonomyRouter.get("/categories", taxonomyController.listCategories);
taxonomyRouter.get("/tags", taxonomyController.listTags);

taxonomyRouter.post("/admin/categories", requireAdmin, validateRequest(createCategorySchema), taxonomyController.createCategory);
taxonomyRouter.put("/admin/categories/:id", requireAdmin, validateRequest(updateCategorySchema), taxonomyController.updateCategory);
taxonomyRouter.delete("/admin/categories/:id", requireAdmin, validateRequest(categoryByIdSchema), taxonomyController.deleteCategory);

taxonomyRouter.post("/admin/tags", requireAdmin, validateRequest(createTagSchema), taxonomyController.createTag);
taxonomyRouter.put("/admin/tags/:id", requireAdmin, validateRequest(updateTagSchema), taxonomyController.updateTag);
taxonomyRouter.delete("/admin/tags/:id", requireAdmin, validateRequest(tagByIdSchema), taxonomyController.deleteTag);
