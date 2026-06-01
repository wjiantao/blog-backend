import { z } from "zod";

export const updateSiteSettingSchema = z.object({
  body: z.object({
    siteName: z.string().min(1).max(120),
    siteDescription: z.string().min(1).max(255),
    heroTitle: z.string().min(1).max(200),
    heroSubtitle: z.string().min(1).max(255),
    seoTitle: z.string().min(1).max(120),
    seoDescription: z.string().min(1).max(255),
    socialGithubUrl: z.string().url().optional().nullable(),
    socialLinkedinUrl: z.string().url().optional().nullable(),
  }),
  params: z.object({}),
  query: z.object({}),
});
