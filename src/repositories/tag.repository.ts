import { prisma } from "../lib/prisma";

export const tagRepository = {
  listAll() {
    return prisma.tag.findMany({ orderBy: { name: "asc" } });
  },
  create(name: string, slug: string) {
    return prisma.tag.create({ data: { name, slug } });
  },
  update(id: number, name: string, slug: string) {
    return prisma.tag.update({ where: { id }, data: { name, slug } });
  },
  delete(id: number) {
    return prisma.tag.delete({ where: { id } });
  },
  findById(id: number) {
    return prisma.tag.findUnique({ where: { id } });
  },
  findBySlug(slug: string, excludeId?: number) {
    return prisma.tag.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) } });
  },
  async existsByIds(ids: number[]) {
    const count = await prisma.tag.count({ where: { id: { in: ids } } });
    return count === ids.length;
  },
};
