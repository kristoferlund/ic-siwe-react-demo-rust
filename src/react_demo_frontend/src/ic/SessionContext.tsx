import { createContext } from "react";
import { SessionContextType } from "./session-context.type";

export const SessionContext = createContext<SessionContextType | undefined>(
  undefined
);
