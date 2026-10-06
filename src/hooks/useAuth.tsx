import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { User } from '../types/user';
import { authApi, LoginPayload, RegisterPayload } from '../api/auth';
import { safeStorage } from '../utils/storage';
import { STORAGE_KEYS } from '../config/site';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const refreshUser = useCallback(async () => {
    const token = safeStorage.getItem(STORAGE_KEYS.authToken);
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      setUser(response.user);
    } catch {
      safeStorage.removeItem(STORAGE_KEYS.authToken);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authApi.login(payload);
      safeStorage.setItem(STORAGE_KEYS.authToken, response.token);
      setUser(response.user);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      await authApi.register(payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed.';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      safeStorage.removeItem(STORAGE_KEYS.authToken);
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isLoading,
        error,
        login,
        register,
        logout,
        refreshUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
