import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";

import { Session } from "./session.type";
import { isErrorResponse } from "./is-error-response";
import { react_demo_backend } from "../../../declarations/react_demo_backend";
import { useGlobalState } from "../state";

type UseSessionReturn = {
  session?: Session;
  setSession: (session?: Session) => void;
  login: () => void;
  isLoggingIn: boolean;
  isError: boolean;
  logout: () => Promise<void>;
  handleErrors: <T>(fn: () => Promise<T>) => Promise<T>;
};

export function useSession(): UseSessionReturn {
  const { signMessage, data, isError } = useSignMessage();
  const { address } = useAccount();

  // Local state
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Global state
  const session = useGlobalState((state) => state.session);
  const setSession = useGlobalState((state) => state.setSession);

  // User has signed the siwe message. Login to backend.
  useEffect(() => {
    if (!data || !address) return;
    if (isLoggingIn) {
      react_demo_backend.login(data, address).then((response) => {
        if ("Ok" in response) {
          setSession(response.Ok);
        } else {
          console.error(response.Err);
        }
        setIsLoggingIn(false);
      });
    }
  }, [data, address, isLoggingIn, setIsLoggingIn, setSession]);

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
    const response = await react_demo_backend.logout();
    if ("Err" in response) {
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

  return {
    session,
    setSession,
    login,
    isLoggingIn,
    isError,
    logout,
    handleErrors,
  };
}
