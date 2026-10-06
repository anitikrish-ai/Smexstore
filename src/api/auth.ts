/**
 * Authentication & Lifecycle API (API-001)
 */

import { apiClient } from './client';
import { User } from '../types/user';

export interface RegisterPayload {
  email: string;
  password: string;
  inGameUsername: string;
  inGameId: string;
}

export interface RegisterResponse {
  message: string;
  userId: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  sessionId: string;
}

export interface VerifyEmailPayload {
  token: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiClient<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  verifyEmail: (payload: VerifyEmailPayload) =>
    apiClient<{ message: string; emailVerified: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: (payload: LoginPayload) =>
    apiClient<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getCurrentUser: () => apiClient<{ user: User }>('/auth/me'),

  logout: () =>
    apiClient<{ message: string }>('/auth/logout', {
      method: 'POST',
    }),

  forgotPassword: (email: string) =>
    apiClient<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (payload: ResetPasswordPayload) =>
    apiClient<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
