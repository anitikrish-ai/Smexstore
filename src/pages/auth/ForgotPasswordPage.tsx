import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { authApi } from '../../api/auth';
import { isValidEmail } from '../../utils/validation';

/**
 * Forgot Password Page (AUTH-003, SEC-003, UX-003)
 * Requests time-limited reset link.
 */
export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidEmail(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setNotice(null);

    try {
      const res = await authApi.forgotPassword(email.trim());
      setNotice(res.message);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Could not submit password reset request.',
      );
    } finally {
      setIsSubmitting(false);
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
            Reset Account Password
          </h1>
          <p
            className="text-muted"
            style={{ fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}
          >
            Enter your registered email address. If an account is found, a secure,
            time-limited reset link will be sent.
          </p>

          {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

          {notice ? (
            <div
              style={{
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-alt)',
                border: 'var(--border-width) solid var(--color-success)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.9rem' }}>{notice}</p>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{ marginTop: 'var(--space-md)' }}
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <label htmlFor="reset-email">Email Address *</label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary motion-press"
                disabled={isSubmitting}
                style={{ width: '100%', marginBottom: 'var(--space-md)' }}
              >
                {isSubmitting ? 'Sending Link...' : 'Send Password Reset Link'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                <Link to="/login" className="inline-link">&larr; Back to Sign In</Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
