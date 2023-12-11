import { Context, useContext } from "react";

import { ActorContextType } from "./actor-context.type";

export function createUseActorHook<T>() {
  return function useActor(context: Context<ActorContextType<T> | undefined>) {
    const actorContext = useContext(context);
    if (!actorContext) {
      throw new Error("useActor must be used within an ActorProvider");
    }
    return actorContext;
  };
}
