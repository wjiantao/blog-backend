import { prisma } from "../lib/prisma";

export const siteSettingRepository = {
  get() {
    return prisma.siteSetting.findUnique({ where: { id: 1 } });
  },
  update(data: {
    siteName: string;
    siteDescription: string;
    heroTitle: string;
    heroSubtitle: string;
    seoTitle: string;
    seoDescription: string;
    socialGithubUrl?: string | null;
    socialLinkedinUrl?: string | null;
  }) {
    return prisma.siteSetting.upsert({
      where: { id: 1 },
      update: data,
      create: {
        id: 1,
        ...data,
      },
    });
  },
};
