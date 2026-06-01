import { Router } from "express";
import { authRouter } from "./auth.routes";
import { commentRouter } from "./comment.routes";
import { dashboardRouter } from "./dashboard.routes";
import { postRouter } from "./post.routes";
import { settingRouter } from "./setting.routes";
import { taxonomyRouter } from "./taxonomy.routes";
import { uploadRouter } from "./upload.routes";

export const apiRouter = Router();

apiRouter.use("/admin/auth", authRouter);
apiRouter.use(dashboardRouter);
apiRouter.use(postRouter);
apiRouter.use(taxonomyRouter);
apiRouter.use(commentRouter);
apiRouter.use(settingRouter);
apiRouter.use(uploadRouter);
