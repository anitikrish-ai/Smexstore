/**
 * Profile & Presets API (API-005, FR-024 to FR-027, TC-008)
 */

import { apiClient } from './client';
import { User, UpdateProfilePayload, PresetAvatar } from '../types/user';

export const profileApi = {
  getProfileById: (userId: string) =>
    apiClient<{ user: User }>(`/profile/${encodeURIComponent(userId)}`),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient<{ user: User }>('/profile/me', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getPresetAvatars: () =>
    apiClient<{ avatars: PresetAvatar[] }>('/profile/preset-avatars'),
};
