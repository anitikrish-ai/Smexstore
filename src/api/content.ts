/**
 * Static & Community Content API (FR-002, FR-070, FR-071)
 */

import { apiClient } from './client';
import { BannerItem, SocialLinkItem, AboutUsInfo } from '../types/content';

export const contentApi = {
  getBanners: () => apiClient<{ banners: BannerItem[] }>('/content/banners'),

  getSocialLinks: () => apiClient<{ socials: SocialLinkItem[] }>('/content/socials'),

  getAboutUs: () => apiClient<AboutUsInfo>('/content/about'),
};
