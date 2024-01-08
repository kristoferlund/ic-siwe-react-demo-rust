/* eslint-disable react-refresh/only-export-components */
import {
  ActorProvider,
  createActorContext,
  createUseActorHook,
} from "ic-use-actor";
import {
  canisterId,
  idlFactory,
} from "../../../declarations/react_demo_backend/index";

import { InterceptorRequestData } from "ic-use-actor/dist/interceptor-data.type";
import { ReactNode } from "react";
import { _SERVICE } from "../../../declarations/react_demo_backend/react_demo_backend.did";
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
    if (delegationChain && !isDelegationValid(delegationChain)) {
      clear(); // Clears the identity from the state and local storage. Effectively "logs the user out".
    } else {
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
