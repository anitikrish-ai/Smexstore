/**
 * Central public-site configuration.
 * SITE_URL is only a public origin. It is not a secret and not proof that a domain is connected.
 */
export const SITE_NAME = 'Smexstore';
export const SITE_URL: string = (
  import.meta.env.VITE_SITE_URL || 'https://smexstore.com'
).replace(/\/+$/, '');
export const LOGO_PATH = '/smexstore-logo.png';
export const STORAGE_KEYS = {
  theme: 'esports_theme',
  density: 'esports_density',
  authToken: 'esports_auth_token',
  welcomeSeen: 'smexstore_welcome_seen_v1',
} as const;
