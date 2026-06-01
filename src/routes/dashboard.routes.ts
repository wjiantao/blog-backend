import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { requireAdmin } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validate";
import { dashboardSummaryQuerySchema } from "../schemas/dashboard.schema";

export const dashboardRouter = Router();

dashboardRouter.get("/admin/dashboard/summary", requireAdmin, validateRequest(dashboardSummaryQuerySchema), dashboardController.summary);
