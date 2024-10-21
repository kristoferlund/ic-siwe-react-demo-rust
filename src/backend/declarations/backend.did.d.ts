import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AvatarUrl = string;
export type GetMyProfileResponse = { 'Ok' : UserProfile } |
  { 'Err' : string };
export type ListProfilesResponse = { 'Ok' : Array<[string, UserProfile]> } |
  { 'Err' : string };
export type Name = string;
export type SaveMyProfileResponse = { 'Ok' : UserProfile } |
  { 'Err' : string };
export interface UserProfile {
  'avatar_url' : string,
  'name' : string,
  'address' : string,
}
export interface _SERVICE {
  'get_my_profile' : ActorMethod<[], GetMyProfileResponse>,
  'list_profiles' : ActorMethod<[], ListProfilesResponse>,
  'save_my_profile' : ActorMethod<[Name, AvatarUrl], SaveMyProfileResponse>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
