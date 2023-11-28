import { PersistStorage, StorageValue, persist } from "zustand/middleware";

import { Session } from "./ic/session.type";
import { create } from "zustand";

interface GlobalState {
  session: Session | undefined;
  setSession: (session: Session | undefined) => void;
}

// Custom replacer function for JSON.stringify to handle bigint
const replacer = (_: string, value: unknown): unknown => {
  if (typeof value === "bigint") {
    return value.toString() + "n"; // Append 'n' to indicate bigint
  }
  return value;
};

// Custom reviver function for JSON.parse to handle bigint
const reviver = (_: string, value: unknown): unknown => {
  if (typeof value === "string" && /^\d+n$/.test(value)) {
    return BigInt(value.slice(0, -1));
  }
  return value;
};

// Define the custom storage
const customStorage: PersistStorage<GlobalState> = {
  getItem: (name: string) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item, reviver) : null;
  },
  setItem: (name: string, value: StorageValue<GlobalState>) => {
    const serializedValue = JSON.stringify(value, replacer);
    localStorage.setItem(name, serializedValue);
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useGlobalState = create<GlobalState>()(
  persist(
    (set) => ({
      session: undefined,
      setSession: (session: Session | undefined) => set({ session }),
    }),
    {
      name: "global-state",
      storage: customStorage,
    }
  )
);
