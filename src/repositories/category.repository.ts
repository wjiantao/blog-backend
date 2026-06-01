import { prisma } from "../lib/prisma";

export const categoryRepository = {
  listAll() {
    return prisma.category.findMany({ orderBy: { name: "asc" } });
  },
  create(name: string, slug: string) {
    return prisma.category.create({ data: { name, slug } });
  },
  update(id: number, name: string, slug: string) {
    return prisma.category.update({ where: { id }, data: { name, slug } });
  },
  delete(id: number) {
    return prisma.category.delete({ where: { id } });
  },
  findById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  },
  findBySlug(slug: string, excludeId?: number) {
    return prisma.category.findFirst({ where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) } });
  },
};
