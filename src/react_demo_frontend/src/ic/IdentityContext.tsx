import { IdentityContextType } from "./identity-context.type";
import { createContext } from "react";

export const IdentityContext = createContext<IdentityContextType | undefined>(
  undefined
);
