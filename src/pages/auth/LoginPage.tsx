import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { PasswordInput } from '../../components/common/PasswordInput';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';

/**
 * Account Login Page (UX-002, AUTH-004, AUTH-006, FR-122)
 * Features password visibility toggle and clear credential error handling.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({
        email: email.trim(),
        password,
      });
      navigate(from, { replace: true });
    } catch {
      // Error handled via AuthContext
    }
  };

  return (
    <PageLayout>
      <div style={{ maxWidth: '440px', margin: 'var(--space-xl) auto' }}>
        <div className="card card-accent" style={{ padding: 'var(--space-xl)' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <BrandLogo size="lg" />
          </div>

          <h1 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-xs)' }}>
            Account Login
          </h1>
          <p
            className="text-muted"
            style={{ fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}
          >
            Sign in to manage tournament registrations, rosters and listings.
          </p>

          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <label htmlFor="login-email">Email Address *</label>
              <input
                id="login-email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* AUTH-004: Password visibility toggle on every password field */}
            <PasswordInput
              id="login-password"
              name="password"
              label="Password"
              required
              placeholder="Enter account password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div
              className="flex justify-between items-center"
              style={{ marginBottom: 'var(--space-lg)', fontSize: '0.8rem' }}
            >
              <span className="text-muted">Need a password reset?</span>
              <Link to="/forgot-password" className="inline-link">Forgot Password</Link>
            </div>

            <button
              type="submit"
              className="btn btn-primary motion-press"
              disabled={isLoading}
              style={{ width: '100%', marginBottom: 'var(--space-md)' }}
            >
              {isLoading ? 'Signing in' : 'Sign In'}
            </button>

            <div
              style={{
                textAlign: 'center',
                fontSize: '0.85rem',
                borderTop: 'var(--border-width) solid var(--color-border)',
                paddingTop: 'var(--space-md)',
              }}
            >
              <span className="text-muted">Do not have an account? </span>
              <Link to="/register" className="inline-link">Create One</Link>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};
