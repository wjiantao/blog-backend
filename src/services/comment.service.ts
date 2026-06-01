import { CommentStatus } from "@prisma/client";
import { commentRepository } from "../repositories/comment.repository";
import { postRepository } from "../repositories/post.repository";
import { HttpError } from "../utils/http-error";
import { toPagination } from "../utils/pagination";

export const commentService = {
  async create(postId: number, nickname: string, content: string) {
    const post = await postRepository.findById(postId);
    if (!post || post.status !== "published" || (post.publishedAt && post.publishedAt > new Date())) {
      throw new HttpError(404, "Post not available for comments");
    }

    return commentRepository.create(postId, nickname, content);
  },

  async listAdmin(query: { page?: string; pageSize?: string; status?: CommentStatus }) {
    const { page, pageSize } = toPagination(query.page, query.pageSize);
    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      commentRepository.count(query.status),
      commentRepository.list(skip, pageSize, query.status),
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

  async updateStatus(id: number, status: CommentStatus) {
    const item = await commentRepository.findById(id);
    if (!item) {
      throw new HttpError(404, "Comment not found");
    }

    return commentRepository.updateStatus(id, status);
  },
};
