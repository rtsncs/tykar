import { createContext, ReactNode, useContext } from "react";
import createClient, { Client } from "openapi-fetch";
import { paths } from "../@types/api";

const apiPath = import.meta.env.VITE_API_PATH as string | undefined;

const ApiContext = createContext<Client<paths> | null>(null);

export function ApiProvider({ children }: { children: ReactNode }) {
  return (
    <ApiContext.Provider value={createClient<paths>({ baseUrl: apiPath })}>
      {children}
    </ApiContext.Provider>
  );
}

export const useApi = () => useContext(ApiContext)!;
