import { createContext, ReactNode, useContext } from "react";
import { Configuration, DefaultApi } from "./gen";

const apiPath = import.meta.env.VITE_API_PATH as string | undefined;

function createClient() {
  const client = new DefaultApi(
    new Configuration({
      basePath: apiPath ?? "http://localhost:3000",
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
