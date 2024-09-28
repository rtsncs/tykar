import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ApiClient } from "./api";
import { LoginRequest } from "./api/gen";

interface Auth {
  session: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const client = useContext(ApiClient);

  const login = async (credentials: LoginRequest) => {
    await client.login(credentials);
    await getSession();
  };

  const logout = async () => {
    await client.logout();
    setSession(null);
  };

  const getSession = async () => {
    try {
      const session = await client.session();
      setSession(session);
    } catch (e) {
      void e;
    }
  };

  useEffect(() => {
    void getSession();
  });

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSession = () => useContext(AuthContext)!;
