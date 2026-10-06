/**
 * Activity History Data Model (DATA-009, FR-100 to FR-102, SEC-006)
 */

import { ActivityVisibility } from './user';

export interface Activity {
  id: string;
  userRef: string;
  event: string;
  eventDetails?: string;
  timestamp: string;
  visibility: ActivityVisibility;
}

export interface LogActivityPayload {
  event: string;
  eventDetails?: string;
}
