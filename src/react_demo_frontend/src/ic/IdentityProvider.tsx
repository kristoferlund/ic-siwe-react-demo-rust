import {
  Actor,
  ActorConfig,
  ActorSubclass,
  DerEncodedPublicKey,
  HttpAgent,
  HttpAgentOptions,
  Signature,
} from "@dfinity/agent";
import {
  Delegation,
  DelegationChain,
  DelegationIdentity,
  Ed25519KeyIdentity,
  SignedDelegation,
} from "@dfinity/identity";
import { ReactNode, useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

import { IDL } from "@dfinity/candid";
import { IdentityContext } from "./IdentityContext";
import { Principal } from "@dfinity/principal";
import { _SERVICE } from "../../../declarations/ic_siwe_provider/ic_siwe_provider.did";

const STATE_STORAGE_KEY = "identityProviderState";

type StoredState = {
  address: string;
  sessionIdentity: string;
  delegationChain: string;
};

/**
 * Provides the Identity context to its children components.
 */
export function IdentityProvider({
  httpAgentOptions,
  actorOptions,
  idlFactory,
  canisterId,
  children,
}: {
  httpAgentOptions?: HttpAgentOptions;
  actorOptions?: ActorConfig;
  idlFactory: IDL.InterfaceFactory;
  canisterId: string;
  children: ReactNode;
}) {
  const { signMessage, data, isError, reset } = useSignMessage();
  const { address } = useAccount();

  // Local state
  const [anonymousActor, setAnonymousActor] =
    useState<ActorSubclass<_SERVICE>>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [identity, setIdentity] = useState<DelegationIdentity>();
  const [identityAddress, setIdentityAddress] = useState<string>();
  const [delegationChain, setDelegationChain] = useState<DelegationChain>();

  /**
   * Loads the identity from local storage.
   */
  function load() {
    try {
      const storedState = localStorage.getItem(STATE_STORAGE_KEY);

      if (!storedState) {
        throw new Error("No stored identity found.");
      }

      const s: StoredState = JSON.parse(storedState);
      if (!s.address || !s.sessionIdentity || !s.delegationChain) {
        throw new Error("Stored state is invalid.");
      }

      const i = Ed25519KeyIdentity.fromJSON(JSON.stringify(s.sessionIdentity));
      const d = DelegationChain.fromJSON(JSON.stringify(s.delegationChain));
      setDelegationChain(d);
      setIdentity(DelegationIdentity.fromDelegation(i, d));
      setIdentityAddress(s.address);
      setIsLoading(false);
    } catch (e) {
      console.error("Error loading identity:", e);
      setIsLoading(false);
      throw e;
    }
  }

  /**
   * Initiates the login process by requesting a SIWE message from the backend.
   */
  function login() {
    if (!anonymousActor || !address) return;
    setIsLoggingIn(true);
    anonymousActor.prepare_login(address).then((response) => {
      if ("Ok" in response) {
        const siweMessage = response.Ok;
        signMessage({ message: siweMessage });
      } else {
        console.error(response.Err);
        setIsLoggingIn(false);
      }
    });
  }

  /**
   * Clears the identity from the state and local storage. Effectively "logs the
   * user out".
   */
  function clear() {
    setIdentity(undefined);
    setIdentityAddress(undefined);
    setDelegationChain(undefined);
    localStorage.removeItem(STATE_STORAGE_KEY);
  }

  /**
   * Load the identity from local storage on mount.
   */
  useEffect(() => {
    try {
      load();
    } catch (e) {
      // Ignore errors
    }
  }, []);

  /**
   * Create an anonymous actor on mount. This actor is used during the login
   * process.
   */
  useEffect(() => {
    (async () => {
      if (!idlFactory || !canisterId) return;
      const agent = new HttpAgent({ ...httpAgentOptions });

      if (process.env.DFX_NETWORK !== "ic") {
        agent.fetchRootKey().catch((err) => {
          console.warn(
            "Unable to fetch root key. Check to ensure that your local replica is running"
          );
          console.error(err);
        });
      }

      setAnonymousActor(
        Actor.createActor<_SERVICE>(idlFactory, {
          agent,
          canisterId,
          ...actorOptions,
        })
      );
    })();
  }, [idlFactory, canisterId, httpAgentOptions, actorOptions]);

  /**
   * Once a signed SIWE message is received, login to the backend.
   */
  useEffect(() => {
    async function callLogin(
      data: `0x${string}` | undefined,
      address: `0x${string}` | undefined,
      sessionPublicKey: DerEncodedPublicKey
    ) {
      if (!anonymousActor || !data || !address) return;

      const loginReponse = await anonymousActor.login(
        data,
        address,
        new Uint8Array(sessionPublicKey)
      );

      if ("Err" in loginReponse) {
        console.error(loginReponse.Err);
        setIsLoggingIn(false);
        return;
      }

      return loginReponse.Ok;
    }

    async function callGetDelegation(
      address: `0x${string}` | undefined,
      sessionPublicKey: DerEncodedPublicKey,
      expiration: bigint
    ) {
      if (!anonymousActor || !address) return;

      const response = await anonymousActor.get_delegation(
        address,
        new Uint8Array(sessionPublicKey),
        expiration
      );

      if ("Err" in response) {
        console.error(response.Err);
        setIsLoggingIn(false);
        return;
      }

      return response.Ok;
    }

    function asSignature(signature: Uint8Array | number[]): Signature {
      const arrayBuffer: ArrayBuffer = (signature as Uint8Array).buffer;
      const s: Signature = arrayBuffer as Signature;
      s.__signature__ = undefined;
      return s;
    }

    function asDerEncodedPublicKey(
      publicKey: Uint8Array | number[]
    ): DerEncodedPublicKey {
      const arrayBuffer: ArrayBuffer = (publicKey as Uint8Array).buffer;
      const pk: DerEncodedPublicKey = arrayBuffer as DerEncodedPublicKey;
      pk.__derEncodedPublicKey__ = undefined;
      return pk;
    }

    /**
     * 1. Generate a new session identity.
     * 2. Call the backend's login method with the signed SIWE message.
     * 3. Call the backend's get_delegation method to get the delegation.
     * 4. Create a new delegation chain from the delegation.
     * 5. Create a new delegation identity from the session identity and the
     *   delegation chain.
     */
    (async () => {
      if (!data || !address) return;
      if (isLoggingIn) {
        const sessionIdentity = Ed25519KeyIdentity.generate();
        const sessionPublicKey = sessionIdentity.getPublicKey().toDer();

        const loginOkResponse = await callLogin(
          data,
          address,
          sessionPublicKey
        );
        if (!loginOkResponse) return;

        const signedDelegation = await callGetDelegation(
          address,
          sessionPublicKey,
          loginOkResponse.expiration
        );
        if (!signedDelegation) return;

        const delegations: SignedDelegation[] = [
          {
            delegation: new Delegation(
              (signedDelegation.delegation.pubkey as Uint8Array).buffer,
              signedDelegation.delegation.expiration,
              signedDelegation.delegation.targets[0] as Principal[]
            ),
            signature: asSignature(signedDelegation.signature),
          },
        ];

        const delegationChain = DelegationChain.fromDelegations(
          delegations,
          asDerEncodedPublicKey(loginOkResponse.user_canister_pubkey)
        );

        const identity = DelegationIdentity.fromDelegation(
          sessionIdentity,
          delegationChain
        );

        localStorage.setItem(
          STATE_STORAGE_KEY,
          JSON.stringify({
            address: address,
            sessionIdentity: sessionIdentity.toJSON(),
            delegationChain: delegationChain.toJSON(),
          })
        );

        reset();
        setDelegationChain(delegationChain);
        setIdentity(identity);
        setIdentityAddress(address);
        setIsLoggingIn(false);
      }
    })();
  }, [data, address, isLoggingIn, anonymousActor, reset]);

  /**
   * If an error occurs during the login process, stop the loading indicator.
   */
  useEffect(() => {
    if (isError) {
      setIsLoggingIn(false);
    }
  }, [isError, setIsLoggingIn]);

  return (
    <IdentityContext.Provider
      value={{
        login,
        clear,
        isLoading,
        isLoggingIn,
        isError,
        delegationChain,
        identity,
        identityAddress,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
}
