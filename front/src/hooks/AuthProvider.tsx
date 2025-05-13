import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApi } from "./ApiProvider";
import type { components } from "@/types/api";

export type LoginRequest = components["schemas"]["LoginRequest"];
type CurrentUser = components["schemas"]["CurrentUserResponse"];

interface Auth {
  session: CurrentUser | null;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  getSession: () => Promise<void>;
}

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<CurrentUser | null>(null);
  const client = useApi();

  const getSession = useCallback(async () => {
    const { data } = await client.GET("/api/users/current");
    if (data) {
      setSession(data);
    }
  }, [client]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const { error } = await client.POST("/api/users/log_in", {
        body: credentials,
      });
      if (error) {
        return false;
      }
      await getSession();
      return true;
    },
    [client, getSession],
  );

  const logout = useCallback(async () => {
    await client.DELETE("/api/users/log_out");
    setSession(null);
  }, [client]);

  useEffect(() => {
    void getSession();
  }, [getSession]);

  return (
    <AuthContext.Provider value={{ session, login, logout, getSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSession = () => useContext(AuthContext)!;
