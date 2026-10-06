import React from 'react';
import { Link } from 'react-router-dom';
import { BrandLogo } from '../brand/BrandLogo';
import { SITE_NAME } from '../../config/site';

/** Site footer. Every link points to a real route. */
export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div
          className="grid grid-cols-1 grid-cols-2-sm grid-cols-4-lg gap-lg"
          style={{ marginBottom: 'var(--space-lg)' }}
        >
          <div>
            <BrandLogo size="lg" />
            <p
              className="text-muted"
              style={{ fontSize: '0.88rem', marginTop: 'var(--space-sm)', maxWidth: 320 }}
            >
              Tournaments, team rosters, a game ID marketplace and rank boosting for the{' '}
              {SITE_NAME} gaming community.
            </p>
          </div>

          <nav aria-label="Compete">
            <h2 className="footer-heading">Compete</h2>
            <div className="footer-links">
              <Link to="/tournaments">Tournaments</Link>
              <Link to="/teams">Teams and Groups</Link>
              <Link to="/leaderboard">Leaderboard</Link>
            </div>
          </nav>

          <nav aria-label="Services">
            <h2 className="footer-heading">Services</h2>
            <div className="footer-links">
              <Link to="/marketplace">Game ID Marketplace</Link>
              <Link to="/rank-boosting">Rank Boosting</Link>
              <Link to="/search">Search</Link>
            </div>
          </nav>

          <nav aria-label="Company and legal">
            <h2 className="footer-heading">Community</h2>
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/socials">Social Links</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms and Conditions</Link>
            </div>
          </nav>
        </div>

        <div className="footer-bottom">
          <div>
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
