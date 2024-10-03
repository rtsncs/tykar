import { createContext, ReactNode, useContext } from "react";
import { Configuration, DefaultApi } from "./gen";

function createClient() {
  const client = new DefaultApi(
    new Configuration({
      basePath: "http://localhost:3000",
      credentials: "include",
    }),
  );
  return client;
}

const ApiContext = createContext<DefaultApi | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  return (
    <ApiContext.Provider value={createClient()}>{children}</ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext)!;
