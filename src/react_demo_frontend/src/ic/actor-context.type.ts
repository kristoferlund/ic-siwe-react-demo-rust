import { ActorSubclass } from "@dfinity/agent";

export type ActorContextType<T> = {
  actor?: ActorSubclass<T>;
};
