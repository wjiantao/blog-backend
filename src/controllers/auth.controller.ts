import { Request, Response } from "express";
import { authService } from "../services/auth.service";

export const authController = {
  async login(req: Request, res: Response) {
    const result = await authService.login(req.body.username, req.body.password);
    return res.json(result);
  },
};
