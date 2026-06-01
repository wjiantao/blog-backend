import { categoryRepository } from "../repositories/category.repository";
import { tagRepository } from "../repositories/tag.repository";
import { HttpError } from "../utils/http-error";
import { createSlug } from "../utils/slug";

export const taxonomyService = {
  listCategories() {
    return categoryRepository.listAll();
  },

  async createCategory(name: string) {
    const slug = createSlug(name);
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      throw new HttpError(409, "Category slug already exists");
    }
    return categoryRepository.create(name, slug);
  },

  async updateCategory(id: number, name: string) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new HttpError(404, "Category not found");
    }

    const slug = createSlug(name);
    const existing = await categoryRepository.findBySlug(slug, id);
    if (existing) {
      throw new HttpError(409, "Category slug already exists");
    }

    return categoryRepository.update(id, name, slug);
  },

  async deleteCategory(id: number) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new HttpError(404, "Category not found");
    }

    await categoryRepository.delete(id);
    return { success: true };
  },

  listTags() {
    return tagRepository.listAll();
  },

  async createTag(name: string) {
    const slug = createSlug(name);
    const existing = await tagRepository.findBySlug(slug);
    if (existing) {
      throw new HttpError(409, "Tag slug already exists");
    }
    return tagRepository.create(name, slug);
  },

  async updateTag(id: number, name: string) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new HttpError(404, "Tag not found");
    }

    const slug = createSlug(name);
    const existing = await tagRepository.findBySlug(slug, id);
    if (existing) {
      throw new HttpError(409, "Tag slug already exists");
    }

    return tagRepository.update(id, name, slug);
  },

  async deleteTag(id: number) {
    const tag = await tagRepository.findById(id);
    if (!tag) {
      throw new HttpError(404, "Tag not found");
    }

    await tagRepository.delete(id);
    return { success: true };
  },
};
