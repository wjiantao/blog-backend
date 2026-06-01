import { Request, Response } from "express";
import { dashboardService } from "../services/dashboard.service";

export const dashboardController = {
  async summary(req: Request, res: Response) {
    const result = await dashboardService.getSummary(typeof req.query.range === "string" ? req.query.range : undefined);
    return res.json(result);
  },
};
