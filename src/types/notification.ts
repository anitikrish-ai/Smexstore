/**
 * Notification Data Model (DATA-008, FR-080)
 */

export type NotificationType = 'request' | 'update';

export interface SourceRef {
  entityType: 'team' | 'tournament' | 'listing' | 'booking' | 'announcement';
  entityId: string;
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  readState: boolean;
  sourceRef?: SourceRef;
  createdAt: string;
}
