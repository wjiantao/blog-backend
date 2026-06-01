import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { apiRouter } from "./routes";
import { errorHandler } from "./middlewares/error-handler";
import { notFoundHandler } from "./middlewares/not-found";

export const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

const uploadRoot = path.resolve(__dirname, "../uploads");
app.use("/uploads", express.static(uploadRoot));

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
