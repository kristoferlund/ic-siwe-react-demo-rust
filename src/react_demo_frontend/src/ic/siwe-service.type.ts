import { ActorMethod } from "@dfinity/agent";
import { Delegation } from "@dfinity/identity";

export type Address = string;
export type SessionKey = PublicKey;
export type PublicKey = Uint8Array | number[];
export type GetDelegationResponse = { Ok: SignedDelegation } | { Err: string };
export interface SignedDelegation {
  signature: Uint8Array | number[];
  delegation: Delegation;
}
export type SiweSignature = string;
export type LoginResponse = { Ok: CanisterPublicKey } | { Err: string };
export type CanisterPublicKey = PublicKey;
export type PrepareLoginResponse = { Ok: SiweMessage } | { Err: string };
export type SiweMessage = string;

export interface SiweService {
  get_delegation: ActorMethod<[Address, SessionKey], GetDelegationResponse>;
  login: ActorMethod<[SiweSignature, Address, SessionKey], LoginResponse>;
  prepare_login: ActorMethod<[Address], PrepareLoginResponse>;
}
