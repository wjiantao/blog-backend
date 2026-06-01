import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(2, "标题至少 2 个字符").max(200, "标题最多 200 个字符"),
    excerpt: z.string().min(10, "摘要至少 10 个字符").max(500, "摘要最多 500 个字符"),
    contentMarkdown: z.string().min(10, "正文至少 10 个字符"),
    categoryId: z.number().int().positive().optional().nullable(),
    tagIds: z.array(z.number().int().positive()).default([]),
    status: z.enum(["draft", "published"]).default("draft"),
    publishedAt: z.string().datetime().optional().nullable(),
  }),
  params: z.object({}),
  query: z.object({}),
});

export const updatePostSchema = z.object({
  body: z.object({
    title: z.string().min(2, "标题至少 2 个字符").max(200, "标题最多 200 个字符"),
    excerpt: z.string().min(10, "摘要至少 10 个字符").max(500, "摘要最多 500 个字符"),
    contentMarkdown: z.string().min(10, "正文至少 10 个字符"),
    categoryId: z.number().int().positive().optional().nullable(),
    tagIds: z.array(z.number().int().positive()).default([]),
    status: z.enum(["draft", "published"]),
    publishedAt: z.string().datetime().optional().nullable(),
  }),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({}),
});

export const publicPostsQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    category: z.string().optional(),
    tag: z.string().optional(),
    keyword: z.string().optional(),
  }),
});

export const adminPostListQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    page: z.string().optional(),
    pageSize: z.string().optional(),
    status: z.enum(["draft", "published"]).optional(),
    keyword: z.string().optional(),
  }),
});

export const postBySlugSchema = z.object({
  body: z.object({}),
  params: z.object({ slug: z.string().min(1) }),
  query: z.object({}),
});

export const postByIdSchema = z.object({
  body: z.object({}),
  params: z.object({ id: z.coerce.number().int().positive() }),
  query: z.object({}),
});
