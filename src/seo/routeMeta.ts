import { SITE_NAME } from '../config/site';

export interface RouteMeta {
  title: string;
  description: string;
  /** Pages behind login or with no search value are kept out of the index. */
  noindex?: boolean;
}

const t = (page: string) => `${page} | ${SITE_NAME}`;

const HOME: RouteMeta = {
  title: `${SITE_NAME} | Esports Tournaments, Teams and Game ID Marketplace`,
  description:
    'Smexstore is a gaming community for esports tournaments, team rosters, a game ID marketplace and rank boosting services.',
};

const STATIC: Record<string, RouteMeta> = {
  '/': HOME,
  '/tournaments': {
    title: t('Tournaments'),
    description: 'Browse ongoing, upcoming and past esports tournaments on Smexstore.',
  },
  '/teams': {
    title: t('Teams and Groups'),
    description: 'Find an esports team or group on Smexstore, or create your own roster.',
  },
  '/marketplace': {
    title: t('Game ID Marketplace'),
    description:
      'Browse game ID listings from community sellers on the Smexstore marketplace.',
  },
  '/marketplace/new': {
    title: t('Create Listing'),
    description: 'Create a game ID listing on Smexstore.',
    noindex: true,
  },
  '/rank-boosting': {
    title: t('Rank Boosting'),
    description: 'View rank boosting packages offered on Smexstore.',
  },
  '/leaderboard': {
    title: t('Leaderboard'),
    description:
      'See community standings for tournaments and teams on the Smexstore leaderboard.',
  },
  '/socials': {
    title: t('Social Links'),
    description:
      'Official Smexstore social channels for announcements and community discussion.',
  },
  '/about': {
    title: t('About'),
    description: 'Learn about Smexstore, its mission and how to get in touch.',
  },
  '/search': {
    title: t('Search'),
    description: 'Search Smexstore tournaments and teams.',
    noindex: true,
  },
  '/privacy': {
    title: t('Privacy Policy'),
    description: 'How Smexstore collects, uses and protects your information.',
  },
  '/terms': {
    title: t('Terms and Conditions'),
    description: 'The terms that apply when you use Smexstore.',
  },
  '/login': {
    title: t('Log in'),
    description: 'Log in to your Smexstore account.',
    noindex: true,
  },
  '/register': {
    title: t('Register'),
    description: 'Create a Smexstore account.',
    noindex: true,
  },
  '/verify-email': {
    title: t('Verify Email'),
    description: 'Verify your Smexstore email address.',
    noindex: true,
  },
  '/forgot-password': {
    title: t('Forgot Password'),
    description: 'Request a Smexstore password reset.',
    noindex: true,
  },
  '/reset-password': {
    title: t('Reset Password'),
    description: 'Set a new Smexstore password.',
    noindex: true,
  },
  '/profile': {
    title: t('Profile'),
    description: 'Your Smexstore profile.',
    noindex: true,
  },
  '/settings': {
    title: t('Settings'),
    description: 'Your Smexstore settings.',
    noindex: true,
  },
  '/notifications': {
    title: t('Notifications'),
    description: 'Your Smexstore notifications.',
    noindex: true,
  },
  '/admin': {
    title: t('Admin'),
    description: 'Smexstore administration.',
    noindex: true,
  },
};

const DYNAMIC: Array<{ pattern: RegExp; meta: RouteMeta }> = [
  {
    pattern: /^\/tournaments\/[^/]+$/,
    meta: {
      title: t('Tournament Details'),
      description: 'Tournament schedule, rules and registration on Smexstore.',
    },
  },
  {
    pattern: /^\/teams\/[^/]+$/,
    meta: {
      title: t('Team Details'),
      description: 'Team roster and details on Smexstore.',
    },
  },
  {
    pattern: /^\/marketplace\/[^/]+$/,
    meta: {
      title: t('Listing Details'),
      description: 'Game ID listing details on the Smexstore marketplace.',
    },
  },
  {
    pattern: /^\/rank-boosting\/[^/]+$/,
    meta: {
      title: t('Rank Boosting Package'),
      description: 'Rank boosting package details on Smexstore.',
    },
  },
  {
    pattern: /^\/profile\/[^/]+$/,
    meta: { title: t('Player Profile'), description: 'Player profile on Smexstore.' },
  },
];

export const NOT_FOUND_META: RouteMeta = {
  title: t('Page Not Found'),
  description: 'The page you were looking for could not be found on Smexstore.',
  noindex: true,
};

export function getRouteMeta(pathname: string): RouteMeta {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (STATIC[clean]) return STATIC[clean];
  const hit = DYNAMIC.find((d) => d.pattern.test(clean));
  return hit ? hit.meta : NOT_FOUND_META;
}
