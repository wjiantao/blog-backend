import { Router } from "express";
import { siteSettingController } from "../controllers/site-setting.controller";
import { requireAdmin } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validate";
import { updateSiteSettingSchema } from "../schemas/settings.schema";

export const settingRouter = Router();

settingRouter.get("/site-settings", siteSettingController.getPublic);
settingRouter.put("/admin/site-settings", requireAdmin, validateRequest(updateSiteSettingSchema), siteSettingController.update);
