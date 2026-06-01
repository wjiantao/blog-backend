import { Request, Response } from "express";
import { siteSettingService } from "../services/site-setting.service";

export const siteSettingController = {
  async getPublic(_req: Request, res: Response) {
    const result = await siteSettingService.getPublic();
    return res.json(result);
  },

  async update(req: Request, res: Response) {
    const result = await siteSettingService.update(req.body);
    return res.json(result);
  },
};
