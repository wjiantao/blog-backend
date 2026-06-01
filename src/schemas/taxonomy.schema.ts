import { z } from "zod";

export const createCategorySchema = z.object({
  body: z.object({ name: z.string().min(1).max(60) }),
  params: z.object({}),
  query: z.object({}),
});

export const updateCategorySchema = z.object({
  body: z.object({ name: z.string().min(1).max(60) }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const categoryByIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const createTagSchema = z.object({
  body: z.object({ name: z.string().min(1).max(60) }),
  params: z.object({}),
  query: z.object({}),
});

export const updateTagSchema = z.object({
  body: z.object({ name: z.string().min(1).max(60) }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const tagByIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({}),
});
