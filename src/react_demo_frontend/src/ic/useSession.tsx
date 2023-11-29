import { useContext } from "react";
import { SessionContextType } from "./session-context.type";
import { SessionContext } from "./SessionContext";

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within an SessionProvider");
  }
  return context;
};
