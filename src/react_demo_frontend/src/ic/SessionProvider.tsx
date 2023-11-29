import { useAccount, useSignMessage } from "wagmi";
import { ReactNode, useEffect, useState } from "react";

import { isErrorResponse } from "./is-error-response";
import {
  canisterId,
  idlFactory,
  react_demo_backend,
} from "../../../declarations/react_demo_backend";
import { useGlobalState } from "../state";
import { SessionContext } from "./SessionContext";
import { useIdentity } from "ic-eth-identity";
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
import { _SERVICE } from "../../../declarations/react_demo_backend/react_demo_backend.did";

/**
 * Provides the Identity context to its children components.
 */
export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const { signMessage, data, isError } = useSignMessage();
  const { address } = useAccount();
  const { identity } = useIdentity();

  // Local state
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE>>();

  // Global state
  const session = useGlobalState((state) => state.session);
  const setSession = useGlobalState((state) => state.setSession);

  // If there is an identity, create an actor based on that identity.
  useEffect(() => {
    (async () => {
      if (!identity) return;
      const agent = new HttpAgent({
        identity,
        host:
          process.env.DFX_NETWORK === "ic"
            ? "https://icp0.io"
            : "http://localhost:4943",
      });

      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check to ensure that your local replica is running"
          );
          console.error(err);
        });
      }
      // Creates an actor with using the candid interface and the HttpAgent
      setActor(
        Actor.createActor(idlFactory, {
          agent,
          canisterId,
        })
      );
    })();
  }, [identity]);

  // User has signed the SIWE message. Login to backend.
  useEffect(() => {
    (async () => {
      if (!data || !address || !actor) return;
      if (isLoggingIn) {
        const response = await actor.login(data, address);
        if ("Ok" in response) {
          setSession(response.Ok);
        } else {
          console.error(response.Err);
        }
        setIsLoggingIn(false);
      }
    })();
  }, [data, address, actor, isLoggingIn, setIsLoggingIn, setSession]);

  // Handle signature rejections
  useEffect(() => {
    if (isError) {
      setIsLoggingIn(false);
    }
  }, [isError, setIsLoggingIn]);

  function login() {
    if (!address) return;
    setIsLoggingIn(true);
    react_demo_backend.create_siwe_message(address).then((response) => {
      if ("Ok" in response) {
        const siweMessage = response.Ok;
        signMessage({ message: siweMessage });
      } else {
        console.error(response.Err);
        setIsLoggingIn(false);
      }
    });
  }

  async function logout(): Promise<void> {
    setSession(undefined);
    const response = await actor?.logout();
    if (response && "Err" in response) {
      console.error(response.Err);
    }
  }

  async function handleErrors<T>(fn: () => Promise<T>): Promise<T> {
    const response = await fn();
    if (isErrorResponse(response)) {
      console.error(response.Err);
      if (response.Err.status === 401) {
        logout();
      }
    }

    return response;
  }

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        login,
        isLoggingIn,
        isError,
        actor,
        logout,
        handleErrors,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
