/**
 * Core Configurable API Client (API-014)
 * Uses VITE_API_BASE_URL and attaches Authorization Bearer token when present.
 * Strictly performs real network requests with no fake responses.
 * Authorization is always enforced server-side. The token here only identifies the caller.
 */

import { safeStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../config/site';

/**
 * Empty until the backend exists. When empty, no network request is made and callers
 * receive a typed "not connected" error that the UI renders as an error or empty state.
 */
const API_BASE_URL: string = (import.meta.env.VITE_API_BASE_URL || '').trim();
const REQUEST_TIMEOUT_MS = 15000;

export const isApiConfigured = (): boolean => API_BASE_URL.length > 0;

export class ApiClientError extends Error {
  statusCode: number;
  details?: Record<string, string>;

  constructor(message: string, statusCode: number, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { params, headers, ...restOptions } = options;

  if (!isApiConfigured()) {
    throw new ApiClientError(
      'The service is not connected yet. Please check back soon.',
      0,
    );
  }

  let url = `${API_BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const token = safeStorage.getItem(STORAGE_KEYS.authToken);

  const requestHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
      signal: restOptions.signal ?? controller.signal,
    });
  } catch (err: unknown) {
    const aborted = err instanceof DOMException && err.name === 'AbortError';
    throw new ApiClientError(
      aborted
        ? 'The request took too long. Please try again.'
        : 'Unable to reach the server. Check your connection and try again.',
      0,
    );
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    let errorDetails: Record<string, string> | undefined;

    try {
      const errorJson = await response.json();
      if (errorJson && typeof errorJson === 'object') {
        errorMessage = errorJson.message || errorMessage;
        errorDetails = errorJson.details;
      }
    } catch {
      // Body is not JSON
    }

    throw new ApiClientError(errorMessage, response.status, errorDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return (await response.json()) as T;
}
