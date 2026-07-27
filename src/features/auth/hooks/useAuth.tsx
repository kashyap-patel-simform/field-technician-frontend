import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  logout as logoutRequest,
  refreshSession,
} from "@/features/auth/api/auth.api";
import type { AuthState, Technician } from "@/features/auth/types/auth.types";
import {
  clearCachedTechnician,
  getCachedTechnician,
  setCachedTechnician,
} from "@/features/auth/lib/technician-cache";
import { ApiRequestError } from "@/lib/http/http-client";
import {
  clearAccessToken,
  setSessionExpiredHandler,
} from "@/lib/http/token-store";

interface AuthContextValue extends AuthState {
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (technician: Technician, accessToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleSessionExpired = useCallback(() => {
    setTechnician(null);
    setAccessTokenState(null);
    void clearCachedTechnician();
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(handleSessionExpired);
    return () => setSessionExpiredHandler(null);
  }, [handleSessionExpired]);

  useEffect(() => {
    let cancelled = false;

    void getCachedTechnician().then((cached) => {
      if (!cancelled && cached) {
        setTechnician(cached);
      }
    });

    refreshSession()
      .then((session) => {
        if (cancelled) return;
        setTechnician(session.technician);
        setAccessTokenState(session.accessToken);
        void setCachedTechnician(session.technician);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        clearAccessToken();
        // A network/offline failure doesn't mean the session is invalid —
        // only an explicit rejection from the server (e.g. 401) does.
        const isOffline =
          error instanceof ApiRequestError && error.status === 0;
        if (!isOffline) {
          handleSessionExpired();
        }
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [handleSessionExpired]);

  const value = useMemo<AuthContextValue>(
    () => ({
      technician,
      accessToken,
      isAuthenticated: technician !== null,
      isInitializing,
      login: (technician, accessToken) => {
        setTechnician(technician);
        setAccessTokenState(accessToken);
        void setCachedTechnician(technician);
      },
      logout: () => {
        handleSessionExpired();
        void logoutRequest();
      },
    }),
    [technician, accessToken, isInitializing, handleSessionExpired],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
