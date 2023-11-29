import { ActorSubclass } from "@dfinity/agent";
import { Session } from "./session.type";
import { _SERVICE } from "../../../declarations/react_demo_backend/react_demo_backend.did";

export type SessionContextType = {
  session?: Session;
  setSession: (session?: Session) => void;
  login: () => void;
  isLoggingIn: boolean;
  isError: boolean;
  actor?: ActorSubclass<_SERVICE>;
  logout: () => Promise<void>;
  handleErrors: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
};
