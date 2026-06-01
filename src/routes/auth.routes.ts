import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validate";
import { loginSchema } from "../schemas/auth.schema";

export const authRouter = Router();

authRouter.post("/login", validateRequest(loginSchema), authController.login);
