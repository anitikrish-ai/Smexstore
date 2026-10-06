import React from 'react';
import { Dialog } from './Dialog';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  isBusy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/** Replacement for window.confirm: accessible, themed, animated. Cancel is focused first. */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  isBusy = false,
  onConfirm,
  onCancel,
}) => (
  <Dialog
    open={open}
    onClose={onCancel}
    title={title}
    description={message}
    maxWidth="440px"
    hideClose
  >
    <div className="dialog-actions">
      <button type="button" className="btn btn-outline" onClick={onCancel} data-autofocus>
        {cancelLabel}
      </button>
      <button
        type="button"
        className={`btn ${destructive ? 'btn-danger' : 'btn-primary'}`}
        onClick={onConfirm}
        disabled={isBusy}
      >
        {confirmLabel}
      </button>
    </div>
  </Dialog>
);
