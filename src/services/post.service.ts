import { PostStatus } from "@prisma/client";
import { postRepository } from "../repositories/post.repository";
import { tagRepository } from "../repositories/tag.repository";
import { HttpError } from "../utils/http-error";
import { toPagination } from "../utils/pagination";
import { createSlug } from "../utils/slug";

type UpsertPostInput = {
  title: string;
  excerpt: string;
  contentMarkdown: string;
  categoryId?: number | null;
  tagIds: number[];
  status: PostStatus;
  publishedAt?: string | null;
};

export const postService = {
  async listPublic(query: {
    page?: string;
    pageSize?: string;
    category?: string;
    tag?: string;
    keyword?: string;
  }) {
    const { page, pageSize } = toPagination(query.page, query.pageSize);
    const skip = (page - 1) * pageSize;
    const now = new Date();

    const [total, items] = await Promise.all([
      postRepository.countPublic(
        {
          category: query.category,
          tag: query.tag,
          keyword: query.keyword,
        },
        now,
      ),
      postRepository.listPublic(
        {
          category: query.category,
          tag: query.tag,
          keyword: query.keyword,
        },
        now,
        skip,
        pageSize,
      ),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    };
  },

  async listAdmin(query: {
    page?: string;
    pageSize?: string;
    status?: "draft" | "published";
    keyword?: string;
  }) {
    const { page, pageSize } = toPagination(query.page, query.pageSize);
    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      postRepository.countAdmin({
        status: query.status,
        keyword: query.keyword,
      }),
      postRepository.listAdmin(
        {
          status: query.status,
          keyword: query.keyword,
        },
        skip,
        pageSize,
      ),
    ]);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    };
  },

  async getAdminById(id: number) {
    const post = await postRepository.findById(id);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }
    return post;
  },

  async getPublicBySlug(slug: string) {
    const post = await postRepository.findBySlug(slug);
    if (!post) {
      throw new HttpError(404, "Post not found");
    }

    if (post.status !== PostStatus.published || (post.publishedAt && post.publishedAt > new Date())) {
      throw new HttpError(404, "Post not found");
    }

    return post;
  },

  async create(input: UpsertPostInput) {
    if (input.tagIds.length > 0) {
      const tagsValid = await tagRepository.existsByIds(input.tagIds);
      if (!tagsValid) {
        throw new HttpError(400, "Some tags do not exist");
      }
    }

    const slug = await this.ensureUniqueSlug(createSlug(input.title));
    const publishedAt = input.status === PostStatus.published ? resolvePublishedAt(input.publishedAt) : null;

    const post = await postRepository.create({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      contentMarkdown: input.contentMarkdown,
      categoryId: input.categoryId ?? null,
      status: input.status,
      publishedAt,
    });

    await postRepository.replaceTags(post.id, input.tagIds);
    return postRepository.findById(post.id);
  },

  async update(postId: number, input: UpsertPostInput) {
    const existing = await postRepository.findById(postId);
    if (!existing) {
      throw new HttpError(404, "Post not found");
    }

    if (input.tagIds.length > 0) {
      const tagsValid = await tagRepository.existsByIds(input.tagIds);
      if (!tagsValid) {
        throw new HttpError(400, "Some tags do not exist");
      }
    }

    const baseSlug = createSlug(input.title);
    const slug = await this.ensureUniqueSlug(baseSlug, postId);
    const publishedAt = input.status === PostStatus.published ? resolvePublishedAt(input.publishedAt) : null;

    await postRepository.update(postId, {
      title: input.title,
      slug,
      excerpt: input.excerpt,
      contentMarkdown: input.contentMarkdown,
      categoryId: input.categoryId ?? null,
      status: input.status,
      publishedAt,
    });

    await postRepository.replaceTags(postId, input.tagIds);
    return postRepository.findById(postId);
  },

  async delete(postId: number) {
    const existing = await postRepository.findById(postId);
    if (!existing) {
      throw new HttpError(404, "Post not found");
    }

    await postRepository.delete(postId);
    return { success: true };
  },

  async ensureUniqueSlug(baseSlug: string, excludeId?: number): Promise<string> {
    const normalizedBase = baseSlug || "post";
    let index = 0;
    let slug = normalizedBase;

    while (true) {
      const taken = await postRepository.isSlugTaken(slug, excludeId);
      if (!taken) {
        return slug;
      }
      index += 1;
      slug = `${normalizedBase}-${index}`;
    }
  },
};

function resolvePublishedAt(raw?: string | null): Date {
  if (!raw) {
    return new Date();
  }
  return new Date(raw);
}
