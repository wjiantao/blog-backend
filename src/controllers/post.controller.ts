import { Request, Response } from "express";
import { postService } from "../services/post.service";

export const postController = {
  async listPublic(req: Request, res: Response) {
    const result = await postService.listPublic(req.query);
    return res.json(result);
  },

  async getPublicBySlug(req: Request, res: Response) {
    const result = await postService.getPublicBySlug(String(req.params.slug));
    return res.json(result);
  },

  async listAdmin(req: Request, res: Response) {
    const result = await postService.listAdmin(req.query);
    return res.json(result);
  },

  async getAdminById(req: Request, res: Response) {
    const result = await postService.getAdminById(Number(req.params.id));
    return res.json(result);
  },

  async create(req: Request, res: Response) {
    const result = await postService.create(req.body);
    return res.status(201).json(result);
  },

  async update(req: Request, res: Response) {
    const result = await postService.update(Number(req.params.id), req.body);
    return res.json(result);
  },

  async delete(req: Request, res: Response) {
    const result = await postService.delete(Number(req.params.id));
    return res.json(result);
  },
};
