import { CommentStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const commentRepository = {
  create(postId: number, nickname: string, content: string) {
    return prisma.comment.create({
      data: {
        postId,
        nickname,
        content,
        status: CommentStatus.pending,
      },
    });
  },
  count(status?: CommentStatus) {
    return prisma.comment.count({ where: status ? { status } : {} });
  },
  list(skip: number, take: number, status?: CommentStatus) {
    return prisma.comment.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: { id: true, title: true, slug: true },
        },
      },
      skip,
      take,
    });
  },
  updateStatus(id: number, status: CommentStatus) {
    return prisma.comment.update({ where: { id }, data: { status } });
  },
  findById(id: number) {
    return prisma.comment.findUnique({ where: { id } });
  },
};
