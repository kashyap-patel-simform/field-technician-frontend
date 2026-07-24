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
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(handleSessionExpired);
    return () => setSessionExpiredHandler(null);
  }, [handleSessionExpired]);

  useEffect(() => {
    refreshSession()
      .then((session) => {
        setTechnician(session.technician);
        setAccessTokenState(session.accessToken);
      })
      .catch(() => {
        clearAccessToken();
      })
      .finally(() => {
        setIsInitializing(false);
      });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      technician,
      accessToken,
      isAuthenticated: accessToken !== null,
      isInitializing,
      login: (technician, accessToken) => {
        setTechnician(technician);
        setAccessTokenState(accessToken);
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
