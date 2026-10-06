import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { authApi } from '../../api/auth';

/**
 * Email Verification Landing Page (AUTH-002, UX-001, TC-009)
 * Themed strictly with DualSpace Crimson/Midnight.
 */
export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    token ? 'verifying' : 'error',
  );
  const [errorMessage, setErrorMessage] = useState<string>(
    token ? '' : 'No verification token provided in URL.',
  );

  useEffect(() => {
    if (!token) return;

    authApi
      .verifyEmail({ token })
      .then(() => {
        setStatus('success');
      })
      .catch((err: unknown) => {
        setStatus('error');
        setErrorMessage(
          err instanceof Error ? err.message : 'Invalid or expired verification token.',
        );
      });
  }, [token]);

  return (
    <PageLayout>
      <div style={{ maxWidth: '480px', margin: 'var(--space-2xl) auto' }}>
        <div
          className="card card-accent text-center"
          style={{ padding: 'var(--space-xl)' }}
        >
          <div
            className="flex justify-center"
            style={{ marginBottom: 'var(--space-md)' }}
          >
            <BrandLogo size="lg" />
          </div>
          {status === 'verifying' && (
            <div>
              <h2 style={{ marginBottom: 'var(--space-md)' }}>Verifying Email Address</h2>
              <p className="text-muted" style={{ marginBottom: 'var(--space-md)' }}>
                Checking your verification link.
              </p>
              <LoadingSkeleton height="4px" />
            </div>
          )}

          {status === 'success' && (
            <div>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-surface-alt)',
                  border: 'var(--border-width) solid var(--color-success)',
                  color: 'var(--color-success-fg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-md) auto',
                  fontSize: '1.5rem',
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </div>
              <h2 style={{ marginBottom: 'var(--space-xs)' }}>Email Verified</h2>
              <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                Your email address has been verified. Full platform features, squad
                management, and marketplace listings are now unlocked.
              </p>
              <Link to="/login" className="btn btn-primary motion-press">
                Proceed to Sign In
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div>
              <h2
                style={{ color: 'var(--color-error)', marginBottom: 'var(--space-xs)' }}
              >
                Verification Failed
              </h2>
              <p className="text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                {errorMessage}
              </p>
              <div className="flex justify-center gap-sm">
                <Link to="/login" className="btn btn-outline">
                  Go to Login
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register Again
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
