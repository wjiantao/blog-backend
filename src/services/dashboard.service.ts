import { CommentStatus, PostStatus } from "@prisma/client";
import { prisma } from "../lib/prisma";

type DashboardRange = "7d" | "30d" | "90d";

const RANGE_DAY_MAP: Record<DashboardRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

export const dashboardService = {
  async getSummary(rawRange?: string) {
    const range = normalizeRange(rawRange);
    const now = new Date();
    const dayCount = RANGE_DAY_MAP[range];
    const rangeStart = startOfDay(addDays(now, -(dayCount - 1)));
    const staleDraftThreshold = addDays(now, -7);

    const [publishedPosts, draftPosts, pendingComments, newPostsInRange, publishedInRange, commentsInRange, pendingTodo, staleDrafts, categories, tags, recentPosts] =
      await Promise.all([
        prisma.post.count({ where: { status: PostStatus.published } }),
        prisma.post.count({ where: { status: PostStatus.draft } }),
        prisma.comment.count({ where: { status: CommentStatus.pending } }),
        prisma.post.count({ where: { createdAt: { gte: rangeStart } } }),
        prisma.post.findMany({
          where: {
            status: PostStatus.published,
            publishedAt: {
              gte: rangeStart,
              lte: now,
            },
          },
          select: { publishedAt: true },
        }),
        prisma.comment.findMany({
          where: {
            createdAt: {
              gte: rangeStart,
              lte: now,
            },
          },
          select: { createdAt: true },
        }),
        prisma.comment.findMany({
          where: { status: CommentStatus.pending },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            post: {
              select: { id: true, title: true, slug: true },
            },
          },
        }),
        prisma.post.findMany({
          where: {
            status: PostStatus.draft,
            updatedAt: { lte: staleDraftThreshold },
          },
          orderBy: { updatedAt: "asc" },
          take: 8,
          select: { id: true, title: true, updatedAt: true },
        }),
        prisma.category.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: { posts: true },
            },
          },
        }),
        prisma.tag.findMany({
          select: {
            id: true,
            name: true,
            _count: {
              select: { postTags: true },
            },
          },
          orderBy: {
            postTags: {
              _count: "desc",
            },
          },
          take: 10,
        }),
        prisma.post.findMany({
          orderBy: { updatedAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            status: true,
            updatedAt: true,
            publishedAt: true,
          },
        }),
      ]);

    const trends = buildDailyTrend(rangeStart, dayCount, publishedInRange, commentsInRange);

    return {
      range,
      generatedAt: now.toISOString(),
      kpis: {
        publishedPosts,
        draftPosts,
        pendingComments,
        newPostsInRange,
      },
      trends,
      todos: {
        pendingComments: pendingTodo,
        staleDrafts,
      },
      distribution: {
        categories: categories
          .map((item) => ({
            id: item.id,
            name: item.name,
            count: item._count.posts,
          }))
          .sort((a, b) => b.count - a.count),
        tags: tags.map((item) => ({
          id: item.id,
          name: item.name,
          count: item._count.postTags,
        })),
      },
      recent: {
        posts: recentPosts,
      },
    };
  },
};

function normalizeRange(rawRange?: string): DashboardRange {
  if (rawRange === "7d" || rawRange === "30d" || rawRange === "90d") {
    return rawRange;
  }
  return "30d";
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatLabel(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function buildDailyTrend(
  rangeStart: Date,
  dayCount: number,
  publishedItems: Array<{ publishedAt: Date | null }>,
  commentItems: Array<{ createdAt: Date }>,
) {
  const points = new Map<string, { date: string; label: string; postsPublished: number; commentsCreated: number }>();
  for (let offset = 0; offset < dayCount; offset += 1) {
    const date = addDays(rangeStart, offset);
    const key = formatDateKey(date);
    points.set(key, {
      date: key,
      label: formatLabel(date),
      postsPublished: 0,
      commentsCreated: 0,
    });
  }

  publishedItems.forEach((item) => {
    if (!item.publishedAt) {
      return;
    }
    const key = formatDateKey(item.publishedAt);
    const point = points.get(key);
    if (point) {
      point.postsPublished += 1;
    }
  });

  commentItems.forEach((item) => {
    const key = formatDateKey(item.createdAt);
    const point = points.get(key);
    if (point) {
      point.commentsCreated += 1;
    }
  });

  return Array.from(points.values());
}
