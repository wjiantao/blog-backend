import { randomUUID } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/upload.controller";
import { requireAdmin } from "../middlewares/auth";
import { HttpError } from "../utils/http-error";

const uploadImageDir = path.resolve(__dirname, "../../uploads/images");
fs.mkdirSync(uploadImageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, uploadImageDir);
  },
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase() || ".png";
    callback(null, `${Date.now()}-${randomUUID()}${extension}`);
  },
});

const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new HttpError(400, "仅支持上传图片文件"));
      return;
    }
    callback(null, true);
  },
});

export const uploadRouter = Router();

uploadRouter.post("/admin/uploads/images", requireAdmin, imageUpload.single("image"), uploadController.uploadImage);
