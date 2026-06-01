import { siteSettingRepository } from "../repositories/site-setting.repository";

export const siteSettingService = {
  async getPublic() {
    return siteSettingRepository.get();
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
    return siteSettingRepository.update(data);
  },
};
