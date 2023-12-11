import { IdentityContext } from "./IdentityContext";
import { IdentityContextType } from "./identity-context.type";
import { useContext } from "react";

export const useIdentity = (): IdentityContextType => {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error("useIdentity must be used within an IdentityProvider");
  }
  return context;
};
