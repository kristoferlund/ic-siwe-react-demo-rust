import { ActorContextType } from "./actor-context.type";
import { createContext } from "react";

export function createActorContext<T>() {
  return createContext<ActorContextType<T> | undefined>(undefined);
}
