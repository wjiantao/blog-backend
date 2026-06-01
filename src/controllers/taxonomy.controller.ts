import { Request, Response } from "express";
import { taxonomyService } from "../services/taxonomy.service";

export const taxonomyController = {
  async listCategories(_req: Request, res: Response) {
    return res.json(await taxonomyService.listCategories());
  },
  async createCategory(req: Request, res: Response) {
    return res.status(201).json(await taxonomyService.createCategory(req.body.name));
  },
  async updateCategory(req: Request, res: Response) {
    return res.json(await taxonomyService.updateCategory(Number(req.params.id), req.body.name));
  },
  async deleteCategory(req: Request, res: Response) {
    return res.json(await taxonomyService.deleteCategory(Number(req.params.id)));
  },
  async listTags(_req: Request, res: Response) {
    return res.json(await taxonomyService.listTags());
  },
  async createTag(req: Request, res: Response) {
    return res.status(201).json(await taxonomyService.createTag(req.body.name));
  },
  async updateTag(req: Request, res: Response) {
    return res.json(await taxonomyService.updateTag(Number(req.params.id), req.body.name));
  },
  async deleteTag(req: Request, res: Response) {
    return res.json(await taxonomyService.deleteTag(Number(req.params.id)));
  },
};
