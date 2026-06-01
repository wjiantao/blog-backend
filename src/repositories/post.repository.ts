import { CommentStatus, PostStatus, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

type PublicPostFilters = {
  status?: PostStatus;
  category?: string;
  tag?: string;
  keyword?: string;
};

type AdminPostFilters = {
  status?: PostStatus;
  keyword?: string;
};

const postInclude = {
  category: true,
  postTags: {
    include: {
      tag: true,
    },
  },
  _count: {
    select: {
      comments: {
        where: {
          status: CommentStatus.approved,
        },
      },
    },
  },
};

export const postRepository = {
  create(data: Prisma.PostUncheckedCreateInput) {
    return prisma.post.create({ data });
  },
  update(id: number, data: Prisma.PostUncheckedUpdateInput) {
    return prisma.post.update({ where: { id }, data });
  },
  delete(id: number) {
    return prisma.post.delete({ where: { id } });
  },
  findById(id: number) {
    return prisma.post.findUnique({
      where: { id },
      include: {
        ...postInclude,
        comments: {
          where: { status: CommentStatus.approved },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },
  findBySlug(slug: string) {
    return prisma.post.findUnique({
      where: { slug },
      include: {
        ...postInclude,
        comments: {
          where: { status: CommentStatus.approved },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  },
  countPublic(filters: PublicPostFilters, now: Date) {
    return prisma.post.count({ where: buildPublicWhere(filters, now) });
  },
  listPublic(filters: PublicPostFilters, now: Date, skip: number, take: number) {
    return prisma.post.findMany({
      where: buildPublicWhere(filters, now),
      include: postInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip,
      take,
    });
  },
  countAdmin(filters: AdminPostFilters) {
    return prisma.post.count({ where: buildAdminWhere(filters) });
  },
  listAdmin(filters: AdminPostFilters, skip: number, take: number) {
    return prisma.post.findMany({
      where: buildAdminWhere(filters),
      include: postInclude,
      orderBy: [{ updatedAt: "desc" }],
      skip,
      take,
    });
  },
  isSlugTaken(slug: string, excludeId?: number) {
    return prisma.post.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
  },
  async replaceTags(postId: number, tagIds: number[]) {
    await prisma.postTag.deleteMany({ where: { postId } });
    if (tagIds.length > 0) {
      await prisma.postTag.createMany({
        data: tagIds.map((tagId) => ({ postId, tagId })),
        skipDuplicates: true,
      });
    }
  },
};

function buildPublicWhere(filters: PublicPostFilters, now: Date): Prisma.PostWhereInput {
  const publishedVisibility: Prisma.PostWhereInput = {
    OR: [{ publishedAt: null }, { publishedAt: { lte: now } }],
  };
  const keywordFilter: Prisma.PostWhereInput | undefined = filters.keyword
    ? {
        OR: [
          { title: { contains: filters.keyword } },
          { excerpt: { contains: filters.keyword } },
          { contentMarkdown: { contains: filters.keyword } },
        ],
      }
    : undefined;

  return {
    status: PostStatus.published,
    AND: [publishedVisibility, ...(keywordFilter ? [keywordFilter] : [])],
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.tag ? { postTags: { some: { tag: { slug: filters.tag } } } } : {}),
  };
}

function buildAdminWhere(filters: AdminPostFilters): Prisma.PostWhereInput {
  return {
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.keyword
      ? {
          OR: [
            { title: { contains: filters.keyword } },
            { excerpt: { contains: filters.keyword } },
          ],
        }
      : {}),
  };
}
