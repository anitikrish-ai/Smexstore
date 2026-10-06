import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../hooks/useNotifications';
import { usePresence } from '../../hooks/usePresence';
import { ThemeToggle } from '../common/ThemeToggle';
import { BrandLogo } from '../brand/BrandLogo';

const PRIMARY_LINKS = [
  { to: '/tournaments', label: 'Tournaments', mobileLabel: 'Tournaments' },
  { to: '/teams', label: 'Teams', mobileLabel: 'Teams and Groups' },
  { to: '/marketplace', label: 'Marketplace', mobileLabel: 'Game ID Marketplace' },
  { to: '/rank-boosting', label: 'Boosting', mobileLabel: 'Rank Boosting' },
  { to: '/leaderboard', label: 'Leaderboard', mobileLabel: 'Leaderboard' },
] as const;

const SECONDARY_LINKS = [
  { to: '/socials', label: 'Social Links' },
  { to: '/about', label: 'About' },
] as const;

/**
 * Global navigation.
 * Desktop: inline links and search from 1024px. Below that: a sheet that hangs from the header
 * edge (absolute, so opening it never shifts page content).
 */
export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const accountRef = useRef<HTMLDivElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const account = usePresence(isAccountOpen);
  const sheet = usePresence(isMenuOpen);

  const closeAll = useCallback(() => {
    setIsAccountOpen(false);
    setIsMenuOpen(false);
  }, []);

  // Close everything when the route changes.
  useEffect(() => {
    closeAll();
  }, [pathname, closeAll]);

  // Outside click, Escape, and leaving the mobile breakpoint.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isAccountOpen) {
        setIsAccountOpen(false);
        accountButtonRef.current?.focus();
      } else if (isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const media = window.matchMedia('(min-width: 1024px)');
    const onMedia = (e: MediaQueryListEvent) => {
      if (e.matches) setIsMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    media.addEventListener('change', onMedia);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      media.removeEventListener('change', onMedia);
    };
  }, [isAccountOpen, isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().slice(0, 100);
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    closeAll();
    await logout();
    navigate('/');
  };

  const displayName = user ? user.inGameUsername || user.email.split('@')[0] : '';

  const navClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' is-active' : ''}`;
  const mobileClass = ({ isActive }: { isActive: boolean }) =>
    `mobile-nav-link${isActive ? ' is-active' : ''}`;

  return (
    <>
      <header className="navbar-wrapper">
        <div className="container flex items-center justify-between navbar-inner">
          <BrandLogo />

          <nav aria-label="Main" className="flex items-center nav-links nav-desktop-only">
            {PRIMARY_LINKS.map((l) => (
              <NavLink key={l.to} to={l.to} className={navClass}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <form
            onSubmit={handleSearchSubmit}
            className="nav-search nav-desktop-only"
            role="search"
          >
            <label htmlFor="desktop-search" className="visually-hidden">
              Search tournaments and teams
            </label>
            <input
              id="desktop-search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              maxLength={100}
              placeholder="Search tournaments or teams"
              style={{
                minHeight: 36,
                padding: '6px 12px',
                fontSize: '0.85rem',
                backgroundColor: 'var(--color-surface-alt)',
              }}
            />
          </form>

          <div className="flex items-center nav-controls">
            <div className="nav-desktop-only">
              <ThemeToggle compact />
            </div>

            {isAuthenticated && user ? (
              <div className="nav-auth-inline items-center gap-sm">
                <Link
                  to="/notifications"
                  className="btn btn-secondary"
                  style={{
                    position: 'relative',
                    minHeight: 36,
                    padding: '4px 12px',
                    fontSize: '0.85rem',
                  }}
                  aria-label={`Notifications, ${unreadCount} unread`}
                >
                  Alerts
                  {unreadCount > 0 && (
                    <span
                      className="tabular-nums"
                      style={{
                        position: 'absolute',
                        top: -7,
                        right: -7,
                        minWidth: 18,
                        textAlign: 'center',
                        backgroundColor: 'var(--color-accent-solid)',
                        color: 'var(--color-accent-text)',
                        fontSize: '0.7rem',
                        lineHeight: '18px',
                        borderRadius: 'var(--radius-sm)',
                        fontWeight: 700,
                      }}
                    >
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                <div ref={accountRef} style={{ position: 'relative' }}>
                  <button
                    ref={accountButtonRef}
                    type="button"
                    onClick={() => setIsAccountOpen((prev) => !prev)}
                    className="btn btn-secondary"
                    aria-expanded={isAccountOpen}
                    aria-controls="account-menu"
                    style={{
                      fontSize: '0.85rem',
                      minHeight: 36,
                      padding: '4px 12px',
                      maxWidth: 160,
                    }}
                  >
                    <span
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {displayName}
                    </span>
                    {isAdmin && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          padding: '1px 4px',
                          backgroundColor: 'var(--color-accent-solid)',
                          color: 'var(--color-accent-text)',
                          borderRadius: 'var(--radius-sm)',
                          fontWeight: 800,
                        }}
                      >
                        ADMIN
                      </span>
                    )}
                  </button>

                  {account.mounted && (
                    <div
                      id="account-menu"
                      className="motion-panel card account-menu"
                      data-state={account.state}
                    >
                      <div
                        style={{
                          padding: 'var(--space-xs) var(--space-md) var(--space-sm)',
                          borderBottom: 'var(--border-width) solid var(--color-border)',
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        Signed in as{' '}
                        <strong style={{ color: 'var(--color-text)' }}>
                          {user.email}
                        </strong>
                      </div>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="menu-item"
                          style={{ color: 'var(--color-accent-fg)', fontWeight: 700 }}
                        >
                          Admin Dashboard
                        </Link>
                      )}
                      <Link to="/profile" className="menu-item">
                        Profile
                      </Link>
                      <Link to="/settings" className="menu-item">
                        Settings and Devices
                      </Link>
                      <div
                        style={{
                          padding: 'var(--space-sm) var(--space-md)',
                          borderTop: 'var(--border-width) solid var(--color-border)',
                        }}
                      >
                        <ThemeToggle compact />
                      </div>
                      <div
                        style={{
                          borderTop: 'var(--border-width) solid var(--color-border)',
                          paddingTop: 'var(--space-xs)',
                        }}
                      >
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="menu-item"
                          style={{ color: 'var(--color-error-fg)' }}
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="nav-auth-inline items-center gap-xs">
                <Link
                  to="/login"
                  className="btn btn-outline"
                  style={{ minHeight: 36, padding: '4px 12px' }}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{ minHeight: 36, padding: '4px 12px' }}
                >
                  Register
                </Link>
              </div>
            )}

            <button
              ref={menuButtonRef}
              type="button"
              className="btn btn-secondary nav-mobile-only"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              style={{ minHeight: 36, padding: '4px 12px' }}
            >
              {isMenuOpen ? 'Close' : 'Menu'}
              {unreadCount > 0 && (
                <span className="visually-hidden">
                  , {unreadCount} unread notifications
                </span>
              )}
            </button>
          </div>
        </div>

        {sheet.mounted && (
          <>
            <div
              id="mobile-menu"
              className="mobile-sheet motion-sheet"
              data-state={sheet.state}
            >
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                style={{ marginBottom: 'var(--space-md)' }}
              >
                <label htmlFor="mobile-search" className="visually-hidden">
                  Search tournaments and teams
                </label>
                <input
                  id="mobile-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  maxLength={100}
                  placeholder="Search tournaments or teams"
                />
              </form>

              <nav
                aria-label="Mobile"
                className="flex flex-col"
                style={{ gap: 2, marginBottom: 'var(--space-md)' }}
              >
                {PRIMARY_LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} className={mobileClass}>
                    {l.mobileLabel}
                  </NavLink>
                ))}
                {SECONDARY_LINKS.map((l) => (
                  <NavLink key={l.to} to={l.to} className={mobileClass}>
                    {l.label}
                  </NavLink>
                ))}
              </nav>

              <div
                style={{
                  borderTop: 'var(--border-width) solid var(--color-border)',
                  paddingTop: 'var(--space-md)',
                }}
              >
                {isAuthenticated && user ? (
                  <div
                    className="flex flex-col"
                    style={{ gap: 2, marginBottom: 'var(--space-md)' }}
                  >
                    <div
                      className="text-muted"
                      style={{
                        fontSize: '0.8rem',
                        padding: '0 var(--space-sm) var(--space-xs)',
                      }}
                    >
                      Signed in as{' '}
                      <strong style={{ color: 'var(--color-text)' }}>
                        {displayName}
                      </strong>
                    </div>
                    {isAdmin && (
                      <NavLink to="/admin" className={mobileClass}>
                        Admin Dashboard
                      </NavLink>
                    )}
                    <NavLink to="/profile" className={mobileClass}>
                      Profile
                    </NavLink>
                    <NavLink to="/notifications" className={mobileClass}>
                      Alerts{unreadCount > 0 ? ` (${unreadCount} unread)` : ''}
                    </NavLink>
                    <NavLink to="/settings" className={mobileClass}>
                      Settings and Devices
                    </NavLink>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mobile-nav-link"
                      style={{
                        color: 'var(--color-error-fg)',
                        justifyContent: 'flex-start',
                      }}
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div
                    className="grid grid-cols-2-sm"
                    style={{ marginBottom: 'var(--space-md)' }}
                  >
                    <Link to="/login" className="btn btn-outline">
                      Log in
                    </Link>
                    <Link to="/register" className="btn btn-primary">
                      Register
                    </Link>
                  </div>
                )}
                <ThemeToggle />
              </div>
            </div>
          </>
        )}
      </header>
      {/* Outside <header>: backdrop-filter on the header would otherwise become the containing block of this fixed layer. */}
      {sheet.mounted && (
        <div
          className="nav-scrim motion-scrim"
          data-state={sheet.state}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
