import { useAccount, useNetwork } from "wagmi";

import LoginPage from "./components/login/LoginPage";
import { isChainIdSupported } from "./wagmi/is-chain-id-supported";
import { useEffect } from "react";
import { useGlobalState } from "./state";
import { useIdentity } from "ic-eth-identity";
import { useSession } from "./ic/useSession";

type AuthGuardProps = {
  children: JSX.Element;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { address: identityAddress, clear: clearIdentity } = useIdentity();
  const { actor } = useSession();
  // Global state
  const session = useGlobalState((state) => state.session);
  const setSession = useGlobalState((state) => state.setSession);

  // If the user is not connected, clear the session.
  useEffect(() => {
    if (!isConnected) {
      setSession(undefined);
      actor?.logout();
    }
  }, [isConnected, setSession, actor]);

  // If user switches to an unsupported network, clear the session.
  useEffect(() => {
    if (!isChainIdSupported(chain?.id)) {
      setSession(undefined);
      actor?.logout();
    }
  }, [chain, setSession, actor]);

  // If the user switches to a different address, clear the session.
  useEffect(() => {
    if (identityAddress && address && address !== identityAddress) {
      clearIdentity?.();
      setSession(undefined);
      actor?.logout();
    }
  }, [address, identityAddress, setSession, clearIdentity, actor]);

  // If wallet is not connected or there is no session, show the login page.
  if (!isConnected || !session) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
