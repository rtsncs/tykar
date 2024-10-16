import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket } from "phoenix";
import { useSession } from "./AuthProvider";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;
    const newSocket = new Socket("/socket", {
      debug: true,
      params: { token: session.token },
    });
    newSocket.connect();
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [session]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext)!;
