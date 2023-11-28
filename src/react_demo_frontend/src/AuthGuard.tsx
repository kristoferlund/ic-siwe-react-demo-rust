import { useAccount, useNetwork } from "wagmi";

import LoginPage from "./components/login/LoginPage";
import { isChainIdSupported } from "./wagmi/is-chain-id-supported";
import { react_demo_backend } from "../../declarations/react_demo_backend";
import { useEffect } from "react";
import { useGlobalState } from "./state";
import { useIdentity } from "ic-eth-identity";

type AuthGuardProps = {
  children: JSX.Element;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { address: identityAddress, clear: clearIdentity } = useIdentity();

  // Global state
  const session = useGlobalState((state) => state.session);
  const setSession = useGlobalState((state) => state.setSession);

  // If the user is not connected, clear the session.
  useEffect(() => {
    if (!isConnected) {
      setSession(undefined);
      react_demo_backend.logout();
    }
  }, [isConnected, setSession]);

  // If user switches to an unsupported network, clear the session.
  useEffect(() => {
    if (!isChainIdSupported(chain?.id)) {
      setSession(undefined);
      react_demo_backend.logout();
    }
  }, [chain, setSession]);

  // If the user switches to a different address, clear the session.
  useEffect(() => {
    if (identityAddress && address && address !== identityAddress) {
      clearIdentity?.();
      setSession(undefined);
      react_demo_backend.logout();
    }
  }, [address, identityAddress, setSession, clearIdentity]);

  // If wallet is not connected or there is no session, show the login page.
  if (!isConnected || !session) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
