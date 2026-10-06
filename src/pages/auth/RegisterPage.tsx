import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../../components/layout/PageLayout';
import { BrandLogo } from '../../components/brand/BrandLogo';
import { PasswordInput } from '../../components/common/PasswordInput';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { useAuth } from '../../hooks/useAuth';
import { checkPassword, isValidEmail, sanitizeText } from '../../utils/validation';

/**
 * Account Registration Page (UX-001, AUTH-001, AUTH-002, AUTH-004)
 * Triggers themed email verification flow upon successful registration.
 */
export const RegisterPage: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inGameUsername, setInGameUsername] = useState('');
  const [inGameId, setInGameId] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError(null);

    const cleanEmail = email.trim();
    const cleanName = sanitizeText(inGameUsername, 40);
    const cleanId = sanitizeText(inGameId, 40);

    if (!isValidEmail(cleanEmail)) {
      setValidationError('Enter a valid email address.');
      return;
    }

    if (!cleanName || !cleanId) {
      setValidationError('In-game username and user ID are required.');
      return;
    }

    const passwordCheck = checkPassword(password);
    if (!passwordCheck.valid) {
      setValidationError(passwordCheck.message);
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    try {
      await register({
        email: cleanEmail,
        password,
        inGameUsername: cleanName,
        inGameId: cleanId,
      });
      setIsSuccess(true);
    } catch {
      // Error handled via AuthContext
    }
  };

  return (
    <PageLayout>
      <div style={{ maxWidth: '480px', margin: 'var(--space-xl) auto' }}>
        <div className="card card-accent" style={{ padding: 'var(--space-xl)' }}>
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <BrandLogo size="lg" />
          </div>

          <h1 style={{ fontSize: '1.4rem', marginBottom: 'var(--space-xs)' }}>
            Register Account
          </h1>
          <p
            className="text-muted"
            style={{ fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}
          >
            Create an account to enter tournaments, build teams and use the game ID
            marketplace.
          </p>

          {validationError && (
            <ErrorMessage
              message={validationError}
              onDismiss={() => setValidationError(null)}
            />
          )}
          {error && <ErrorMessage message={error} onDismiss={clearError} />}

          {isSuccess ? (
            <div
              style={{
                padding: 'var(--space-md)',
                backgroundColor: 'var(--color-surface-alt)',
                border: 'var(--border-width) solid var(--color-success)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
              }}
            >
              <h3
                style={{
                  color: 'var(--color-success-fg)',
                  marginBottom: 'var(--space-xs)',
                }}
              >
                Registration Submitted
              </h3>
              <p
                className="text-muted"
                style={{ fontSize: '0.9rem', marginBottom: 'var(--space-md)' }}
              >
                A verification link has been sent to <strong>{email}</strong>. Check your
                inbox and verify your email to unlock all features.
              </p>
              <Link to="/login" className="btn btn-primary">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <label htmlFor="reg-email">Email Address *</label>
                <input
                  id="reg-email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div
                className="grid grid-cols-1 grid-cols-2-sm gap-md"
                style={{ marginBottom: 'var(--space-md)' }}
              >
                <div>
                  <label htmlFor="reg-ign">In-Game Username *</label>
                  <input
                    id="reg-ign"
                    type="text"
                    required
                    maxLength={40}
                    autoComplete="username"
                    placeholder="e.g. ApexLegend"
                    value={inGameUsername}
                    onChange={(e) => setInGameUsername(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="reg-id">In-Game User ID *</label>
                  <input
                    id="reg-id"
                    type="text"
                    required
                    maxLength={40}
                    placeholder="e.g. #12345"
                    value={inGameId}
                    onChange={(e) => setInGameId(e.target.value)}
                  />
                </div>
              </div>

              {/* AUTH-004: Password visibility toggles on every password field */}
              <PasswordInput
                id="reg-password"
                name="password"
                label="Password (min. 8 characters)"
                required
                autoComplete="new-password"
                placeholder="Create strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PasswordInput
                id="reg-confirm-password"
                name="confirmPassword"
                label="Confirm Password"
                required
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="submit"
                className="btn btn-primary motion-press"
                disabled={isLoading}
                style={{ width: '100%', marginBottom: 'var(--space-md)' }}
              >
                {isLoading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <div
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  borderTop: 'var(--border-width) solid var(--color-border)',
                  paddingTop: 'var(--space-md)',
                }}
              >
                <span className="text-muted">Already registered? </span>
                <Link to="/login" className="inline-link">Sign In</Link>
              </div>
              <p
                className="text-muted"
                style={{
                  fontSize: '0.78rem',
                  textAlign: 'center',
                  marginTop: 'var(--space-md)',
                  marginBottom: 0,
                }}
              >
                By registering you agree to the{' '}
                <Link to="/terms" className="inline-link">Terms and Conditions</Link> and the{' '}
                <Link to="/privacy" className="inline-link">Privacy Policy</Link>.
              </p>
            </form>
          )}
        </div>
      </div>
    </PageLayout>
  );
};
