import React, { useState } from 'react';

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

/**
 * Accessible Password Input with Show/Hide Toggle (AUTH-004, FR-094)
 */
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  id,
  name,
  value,
  onChange,
  required,
  placeholder,
  autoComplete = 'current-password',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const inputId = id || `password-field-${name || 'input'}`;

  return (
    <div style={{ marginBottom: 'var(--space-md)' }}>
      <label htmlFor={inputId}>
        {label} {required && <span style={{ color: 'var(--color-accent)' }}>*</span>}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          {...props}
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            paddingRight: '4.5rem',
            borderColor: error ? 'var(--color-error)' : undefined,
          }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="ui-interactive"
          style={{
            position: 'absolute',
            right: 'var(--space-xs)',
            padding: '4px 8px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            background: 'var(--color-surface-alt)',
            border: 'var(--border-width) solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--color-text-muted)',
            cursor: 'pointer',
          }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && (
        <span
          style={{
            display: 'block',
            fontSize: '0.8rem',
            color: 'var(--color-error)',
            marginTop: 'var(--space-xs)',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
