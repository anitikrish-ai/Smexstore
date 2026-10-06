import React, { useCallback, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog } from '../common/Dialog';
import { BrandLogo } from '../brand/BrandLogo';
import { useAuth } from '../../hooks/useAuth';
import { hasSeenWelcome, hasStoredSession, markWelcomeSeen } from '../../utils/welcome';

/** Routes where an interruption would be unhelpful: sign-in flows and legal text. */
const QUIET_ROUTES = new Set([
  '/login',
  '/register',
  '/verify-email',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
]);

const GUIDE: ReadonlyArray<{ to: string; title: string; text: string }> = [
  {
    to: '/tournaments',
    title: 'Tournaments',
    text: 'Browse ongoing, upcoming and past events.',
  },
  { to: '/teams', title: 'Teams', text: 'Find a roster to join or start your own.' },
  {
    to: '/marketplace',
    title: 'Marketplace',
    text: 'Browse game ID listings from community sellers.',
  },
  {
    to: '/rank-boosting',
    title: 'Rank Boosting',
    text: 'See the rank boosting packages on offer.',
  },
];

/**
 * One-time welcome for genuinely new visitors. Shown only when this browser has never dismissed it,
 * no saved session exists, and the visitor is not signed in. Dismissing by any route records it.
 */
export const WelcomeDialog: React.FC = () => {
  const { pathname } = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [open, setOpen] = useState(false);

  const eligible =
    !isLoading &&
    !isAuthenticated &&
    !hasStoredSession() &&
    !hasSeenWelcome() &&
    !QUIET_ROUTES.has(pathname);

  // Anyone who is signed in is not a new visitor. Record it so logging out later does not trigger the welcome.
  useEffect(() => {
    if (isAuthenticated) {
      markWelcomeSeen();
      setOpen(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!eligible || open) return;
    const id = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(id);
  }, [eligible, open]);

  const dismiss = useCallback(() => {
    markWelcomeSeen();
    setOpen(false);
  }, []);

  return (
    <Dialog
      open={open}
      onClose={dismiss}
      title="Welcome to Smexstore"
      maxWidth="560px"
      hideClose
    >
      <div style={{ marginBottom: 'var(--space-md)' }}>
        <BrandLogo size="lg" asImage />
      </div>

      <p style={{ marginBottom: 'var(--space-md)' }}>
        Smexstore is a gaming community built around esports tournaments, team rosters, a
        game ID marketplace and rank boosting services.
      </p>

      <ul
        style={{
          listStyle: 'none',
          display: 'grid',
          gap: 'var(--space-sm)',
          marginBottom: 'var(--space-lg)',
        }}
      >
        {GUIDE.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              onClick={dismiss}
              className="card motion-card-lift"
              style={{
                display: 'block',
                padding: 'var(--space-sm) var(--space-md)',
                color: 'var(--color-text)',
                textDecoration: 'none',
              }}
            >
              <span style={{ fontWeight: 700 }}>{item.title}</span>
              <span
                className="text-muted"
                style={{ display: 'block', fontSize: '0.85rem' }}
              >
                {item.text}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="dialog-actions">
        <button type="button" className="btn btn-outline" onClick={dismiss}>
          Skip for now
        </button>
        <div className="dialog-actions-main">
          <Link to="/register" className="btn btn-secondary" onClick={dismiss}>
            Create an account
          </Link>
          <Link
            to="/tournaments"
            className="btn btn-primary"
            onClick={dismiss}
            data-autofocus
          >
            Browse tournaments
          </Link>
        </div>
      </div>
    </Dialog>
  );
};
