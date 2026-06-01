import { Request, Response } from "express";
import { commentService } from "../services/comment.service";

export const commentController = {
  async create(req: Request, res: Response) {
    const result = await commentService.create(req.body.postId, req.body.nickname, req.body.content);
    return res.status(201).json(result);
  },
  async listAdmin(req: Request, res: Response) {
    const result = await commentService.listAdmin(req.query);
    return res.json(result);
  },
  async updateStatus(req: Request, res: Response) {
    const result = await commentService.updateStatus(Number(req.params.id), req.body.status);
    return res.json(result);
  },
};
