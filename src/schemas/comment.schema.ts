import { z } from "zod";

export const createCommentSchema = z.object({
  body: z.object({
    postId: z.number().int().positive(),
    nickname: z.string().min(1).max(80),
    content: z.string().min(1).max(1000),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const adminCommentsQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
  }),
});

export const updateCommentStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "approved", "rejected"]),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({}),
});
