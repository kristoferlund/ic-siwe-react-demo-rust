import { useAccount, useNetwork } from "wagmi";

import AddressPill from "./AddressPill";
import Button from "../ui/Button";
import ConnectButton from "./ConnectButton";
import IdentityButton from "./IdentityButton";
import LoginButton from "./LoginButton";
import PrincipalPill from "./PrincipalPill";
import { faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { isChainIdSupported } from "../../wagmi/is-chain-id-supported";
import { useIdentity } from "ic-eth-identity";

export default function LoginPage(): React.ReactElement {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { identity } = useIdentity();

  return (
    <div className="w-full items-center justify-center h-screen flex flex-col gap-10">
      <div className="flex items-center justify-center gap-20">
        <img alt="ic" className="w-28 h-28" src="/ic.svg" />
        <img alt="react" className="w-28 h-28" src="/react.svg" />
        <img alt="siwe" className="w-28 h-28" src="/siwe.svg" />
      </div>
      <div className="text-5xl font-bold">
        Internet Computer + React + Sign In With Ethereum
      </div>
      <div className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 px-5 drop-shadow-xl rounded-3xl flex flex-col items-center py-5 mt-8">
        <div className="flex flex-col items-center gap-10 p-8 w-full">
          <div className="text-4xl font-bold">Sign In</div>
          <div className="flex w-full items-center justify-between">
            <div className="text-xl font-bold flex items-center gap-2">
              <div className="flex justify-center items-center rounded-full bg-zinc-300 w-8 h-8 text-zinc-800">
                1
              </div>
              Connect Ethereum Wallet
            </div>
            <div>
              {!isConnected && <ConnectButton />}
              {isConnected && isChainIdSupported(chain?.id) && <AddressPill />}
              {isConnected && !isChainIdSupported(chain?.id) && (
                <Button disabled icon={faWaveSquare} variant="outline">
                  Unsupported Network
                </Button>
              )}
            </div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="text-xl font-bold flex items-center gap-2">
              <div className="flex justify-center items-center rounded-full bg-zinc-300 w-8 h-8 text-zinc-800">
                2
              </div>
              Create Identity
            </div>
            <div>{identity ? <PrincipalPill /> : <IdentityButton />}</div>
          </div>
          <div className="flex w-full items-center justify-between">
            <div className="text-xl font-bold flex items-center gap-2">
              <div className="flex justify-center items-center rounded-full bg-zinc-300 w-8 h-8 text-zinc-800">
                3
              </div>
              Login
            </div>
            <div>
              {" "}
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
