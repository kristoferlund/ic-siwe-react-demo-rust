import { DelegationChain, DelegationIdentity } from "@dfinity/identity";

export type IdentityContextType = {
  /**
   * Initiates the login process by requesting a SIWE message from the backend.
   */
  login: () => void;

  /**
   * Clears the identity from the state and local storage. Effectively "logs the
   * user out".
   */
  clear: () => void;
  isLoggingIn: boolean;
  isError: boolean;
  delegationChain?: DelegationChain;
  identity?: DelegationIdentity;
  identityAddress?: string;
};
