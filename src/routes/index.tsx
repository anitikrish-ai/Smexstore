import React, { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SiteShell } from '../components/layout/SiteShell';
import { RoleGuard } from '../components/layout/RoleGuard';

/**
 * Every page is code-split. Pages use named exports, so each import is adapted to a default export.
 */
const page = <K extends string>(
  loader: () => Promise<Record<K, React.ComponentType>>,
  name: K,
) => lazy(() => loader().then((m) => ({ default: m[name] })));

const HomePage = page(() => import('../pages/HomePage'), 'HomePage');
const TournamentsPage = page(() => import('../pages/TournamentsPage'), 'TournamentsPage');
const TournamentDetailPage = page(
  () => import('../pages/TournamentDetailPage'),
  'TournamentDetailPage',
);
const TeamsPage = page(() => import('../pages/TeamsPage'), 'TeamsPage');
const TeamDetailPage = page(() => import('../pages/TeamDetailPage'), 'TeamDetailPage');
const MarketplacePage = page(() => import('../pages/MarketplacePage'), 'MarketplacePage');
const ListingDetailPage = page(
  () => import('../pages/ListingDetailPage'),
  'ListingDetailPage',
);
const CreateListingPage = page(
  () => import('../pages/CreateListingPage'),
  'CreateListingPage',
);
const RankBoostingPage = page(
  () => import('../pages/RankBoostingPage'),
  'RankBoostingPage',
);
const LeaderboardPage = page(() => import('../pages/LeaderboardPage'), 'LeaderboardPage');
const ProfilePage = page(() => import('../pages/ProfilePage'), 'ProfilePage');
const SettingsPage = page(() => import('../pages/SettingsPage'), 'SettingsPage');
const UniversalSearchPage = page(
  () => import('../pages/UniversalSearchPage'),
  'UniversalSearchPage',
);
const NotificationsPage = page(
  () => import('../pages/NotificationsPage'),
  'NotificationsPage',
);
const SocialsPage = page(() => import('../pages/SocialsPage'), 'SocialsPage');
const AboutPage = page(() => import('../pages/AboutPage'), 'AboutPage');
const PrivacyPage = page(() => import('../pages/PrivacyPage'), 'PrivacyPage');
const TermsPage = page(() => import('../pages/TermsPage'), 'TermsPage');
const NotFoundPage = page(() => import('../pages/NotFoundPage'), 'NotFoundPage');

const LoginPage = page(() => import('../pages/auth/LoginPage'), 'LoginPage');
const RegisterPage = page(() => import('../pages/auth/RegisterPage'), 'RegisterPage');
const VerifyEmailPage = page(
  () => import('../pages/auth/VerifyEmailPage'),
  'VerifyEmailPage',
);
const ForgotPasswordPage = page(
  () => import('../pages/auth/ForgotPasswordPage'),
  'ForgotPasswordPage',
);
const ResetPasswordPage = page(
  () => import('../pages/auth/ResetPasswordPage'),
  'ResetPasswordPage',
);

const AdminDashboardPage = page(
  () => import('../pages/admin/AdminDashboardPage'),
  'AdminDashboardPage',
);

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<SiteShell />}>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/tournaments" element={<TournamentsPage />} />
        <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/marketplace/:id" element={<ListingDetailPage />} />
        <Route path="/rank-boosting" element={<RankBoostingPage />} />
        <Route path="/rank-boosting/:id" element={<RankBoostingPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/socials" element={<SocialsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/search" element={<UniversalSearchPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />

        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Authenticated routes. Guards hide UI only; the backend must enforce access on every endpoint. */}
        <Route
          path="/marketplace/new"
          element={
            <RoleGuard>
              <CreateListingPage />
            </RoleGuard>
          }
        />
        <Route
          path="/profile"
          element={
            <RoleGuard>
              <ProfilePage />
            </RoleGuard>
          }
        />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route
          path="/settings"
          element={
            <RoleGuard>
              <SettingsPage />
            </RoleGuard>
          }
        />
        <Route
          path="/notifications"
          element={
            <RoleGuard>
              <NotificationsPage />
            </RoleGuard>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RoleGuard requireAdmin>
              <AdminDashboardPage />
            </RoleGuard>
          }
        />

        {/* Custom 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
