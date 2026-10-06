/**
 * User & Account Data Model (DATA-001)
 */

export type UserRole = 'normal_user' | 'admin';
export type ThemeMode = 'crimson' | 'midnight';
export type DensityPreference = 'compact' | 'comfortable' | 'spacious';
export type ActivityVisibility = 'public' | 'hidden' | 'off';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  emailVerified: boolean;
  presetProfilePictureRef: string;
  inGameId: string;
  inGameUsername: string;
  inGameRole: string;
  bio: string;
  theme: ThemeMode;
  density: DensityPreference;
  activityVisibility: ActivityVisibility;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfilePayload {
  presetProfilePictureRef?: string;
  inGameId?: string;
  inGameUsername?: string;
  inGameRole?: string;
  bio?: string;
  theme?: ThemeMode;
  density?: DensityPreference;
  activityVisibility?: ActivityVisibility;
}

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
}
