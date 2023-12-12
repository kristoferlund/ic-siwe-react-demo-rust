import React, { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import LoginPage from "./components/login/LoginPage";
import { isChainIdSupported } from "./wagmi/is-chain-id-supported";
import { useIdentity } from "./ic/useIdentity";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { clear, isLoading, identity, identityAddress } = useIdentity();

  // If the user is not connected, clear the session.
  useEffect(() => {
    if (!isConnected) {
      clear();
    }
  }, [isConnected, clear]);

  // If user switches to an unsupported network, clear the session.
  useEffect(() => {
    if (!isChainIdSupported(chain?.id)) {
      clear();
    }
  }, [chain, clear]);

  // If the user switches to a different address, clear the session.
  useEffect(() => {
    if (identityAddress && address && address !== identityAddress) {
      clear();
    }
  }, [address, clear, identityAddress]);

  // If wallet is not connected or there is no identity, show login page.
  if (!isLoading && (!isConnected || !identity)) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
