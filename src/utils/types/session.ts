/**
 * Session & Device Data Model (DATA-002, DEV-001 to DEV-004)
 */

export interface DeviceMetadata {
  browser: string;
  os: string;
  deviceType: string;
  ipAddress?: string;
  approximateLocation?: string;
}

export interface SessionDevice {
  sessionId: string;
  userId: string;
  deviceMetadata: DeviceMetadata;
  loginTimestamp: string;
  lastActiveTimestamp?: string;
  status: 'active' | 'revoked';
  isCurrent?: boolean;
}

export interface LoginHistoryItem {
  id: string;
  userId: string;
  timestamp: string;
  ipAddress?: string;
  approximateLocation?: string;
  deviceSummary: string;
  status: 'success' | 'failed';
}
