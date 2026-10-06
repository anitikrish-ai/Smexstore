import React, { useEffect, useId, useRef } from 'react';
import { usePresence } from '../../hooks/usePresence';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional visible description, also wired to aria-describedby. */
  description?: string;
  children: React.ReactNode;
  maxWidth?: string;
  /** Hide the built-in close button when the content supplies its own. */
  hideClose?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal dialog: focus moves in, is trapped, Escape closes, focus returns to the trigger,
 * and page scroll is locked while open. Enter and exit use the shared motion classes.
 */
export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth,
  hideClose = false,
}) => {
  const { mounted, state } = usePresence(open);
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    if (!open) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const frame = window.requestAnimationFrame(() => {
      const first =
        panelRef.current?.querySelector<HTMLElement>('[data-autofocus]') ??
        panelRef.current;
      first?.focus({ preventScroll: true });
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      const active = document.activeElement;
      // If no focusable children, keep focus on the panel itself
      if (nodes.length === 0) {
        e.preventDefault();
        panelRef.current.focus({ preventScroll: true });
        return;
      }
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const atFirst = active === first || active === panelRef.current;
      const atLast = active === last;
      if (e.shiftKey && atFirst) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && atLast) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      returnFocusRef.current?.focus?.({ preventScroll: true });
    };
  }, [open, onClose]);

  if (!mounted) return null;

  return (
    <div
      className="dialog-backdrop motion-scrim"
      data-state={state}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="dialog-panel motion-dialog"
        data-state={state}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        style={maxWidth ? { maxWidth } : undefined}
      >
        <div
          className="flex justify-between items-center gap-md"
          style={{ marginBottom: 'var(--space-sm)' }}
        >
          <h2 id={titleId} style={{ margin: 0 }}>
            {title}
          </h2>
          {!hideClose && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              aria-label="Close dialog"
            >
              Close
            </button>
          )}
        </div>
        {description && (
          <p
            id={descId}
            className="text-muted"
            style={{ marginBottom: 'var(--space-md)' }}
          >
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};
