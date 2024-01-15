/* eslint-disable react-refresh/only-export-components */
import {
  ActorProvider,
  InterceptorRequestData,
  createActorContext,
  createUseActorHook,
} from "ic-use-actor";
import { canisterId, idlFactory } from "../../../declarations/backend/index";

import { ReactNode } from "react";
import { _SERVICE } from "../../../declarations/backend/backend.did";
import { isDelegationValid } from "@dfinity/identity";
import toast from "react-hot-toast";
import { useSiweIdentity } from "ic-use-siwe-identity";

const actorContext = createActorContext<_SERVICE>();
export const useActor = createUseActorHook<_SERVICE>(actorContext);

export default function Actors({ children }: { children: ReactNode }) {
  const { identity, delegationChain, clear } = useSiweIdentity();

  const errorToast = (error: unknown) => {
    if (typeof error === "object" && error !== null && "message" in error) {
      toast.error(error.message as string, {
        position: "bottom-right",
      });
    }
  };

  const handleResponseError = (error: unknown) => {
    console.error("onResponseError", error);

    // This could be done using a library like Zod, but I don't want to add a dependency for this one check.
    if (
      (delegationChain && !isDelegationValid(delegationChain)) || // Delegation (most likely) expired
      (typeof error === "object" &&
        error !== null &&
        "error" in error &&
        typeof error.error === "object" &&
        error.error !== null &&
        "name" in error.error &&
        error.error.name === "AgentHTTPResponseError" &&
        "message" in error.error &&
        typeof error.error.message === "string" &&
        error.error.message.includes(
          "Invalid delegation: Invalid canister signature"
        ) &&
        "response" in error.error &&
        error.error.response !== null &&
        typeof error.error.response === "object" &&
        "status" in error.error.response &&
        error.error.response.status === 403) // Some other issue with the delegation
    ) {
      toast.error("Invalid Identity", {
        id: "invalid-identity",
        position: "bottom-right",
      });
      setTimeout(() => {
        clear(); // Clears the identity from the state and local storage. Effectively "logs the user out".
      }, 1000);
      return;
    }

    if (typeof error === "object" && error !== null && "message" in error) {
      errorToast(error);
    }
  };

  const handleRequest = (data: InterceptorRequestData) => {
    console.log("onRequest", data.args, data.methodName);
    return data.args;
  };

  return (
    <ActorProvider<_SERVICE>
      canisterId={canisterId}
      context={actorContext}
      identity={identity}
      idlFactory={idlFactory}
      onRequest={handleRequest}
      onRequestError={(error) => errorToast(error)}
      onResponseError={handleResponseError}
    >
      {children}
    </ActorProvider>
  );
}
