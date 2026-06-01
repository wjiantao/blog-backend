import { Request, Response } from "express";
import { HttpError } from "../utils/http-error";

export const uploadController = {
  uploadImage(req: Request, res: Response) {
    if (!req.file) {
      throw new HttpError(400, "请上传图片文件");
    }

    const host = req.get("host");
    if (!host) {
      throw new HttpError(400, "无法解析上传地址");
    }

    const protocol = req.protocol;
    const normalizedPath = req.file.path.replaceAll("\\", "/");
    const marker = "/uploads/";
    const uploadIndex = normalizedPath.lastIndexOf(marker);
    if (uploadIndex === -1) {
      throw new HttpError(500, "上传路径异常");
    }

    const relativePath = normalizedPath.slice(uploadIndex);
    const url = `${protocol}://${host}${relativePath}`;

    return res.status(201).json({
      url,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
    });
  },
};
