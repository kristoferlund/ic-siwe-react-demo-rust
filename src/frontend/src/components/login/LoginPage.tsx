import { useAccount, useNetwork } from "wagmi";

import AddressPill from "../AddressPill";
import Button from "../ui/Button";
import ConnectButton from "./ConnectButton";
import LoginButton from "./LoginButton";
import { faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { isChainIdSupported } from "../../wagmi/is-chain-id-supported";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function LoginPage(): React.ReactElement {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { prepareLogin, prepareLoginStatus, prepareLoginError, loginError } =
    useSiweIdentity();

  /**
   * Preload a Siwe message on every address change.
   */
  useEffect(() => {
    if (prepareLoginStatus !== "idle" || !isConnected || !address) return;
    prepareLogin();
  }, [isConnected, address, prepareLogin, prepareLoginStatus]);

  /**
   * Show an error toast if the prepareLogin() call fails.
   */
  useEffect(() => {
    if (prepareLoginError) {
      toast.error(prepareLoginError.message, {
        position: "bottom-right",
      });
    }
  }, [prepareLoginError]);

  /**
   * Show an error toast if the login call fails.
   */
  useEffect(() => {
    if (loginError) {
      toast.error(loginError.message, {
        position: "bottom-right",
      });
    }
  }, [loginError]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen gap-10">
      <div className="flex items-center justify-center gap-5 md:gap-20">
        <img alt="ic" className="w-28 h-28" src="/ic.svg" />
        <img alt="react" className="w-28 h-28" src="/react.svg" />
        <img alt="siwe" className="w-28 h-28" src="/siwe.svg" />
      </div>
      <div className="text-2xl font-bold text-center md:text-5xl">
        Internet Computer + React + Sign In With Ethereum
      </div>
      <div className="w-full max-w-sm border-zinc-700/50 border-[1px] bg-zinc-900 px-5 drop-shadow-xl rounded-3xl flex flex-col items-center py-5 mt-8">
        <div className="flex flex-col items-center w-full gap-10 p-8">
          <div className="flex items-center justify-center w-full gap-5">
            <div className="flex items-center justify-center w-8 h-8 text-xl font-bold rounded-full bg-zinc-300 text-zinc-800">
              1
            </div>
            <div>
              {!isConnected && <ConnectButton />}
              {isConnected && isChainIdSupported(chain?.id) && (
                <AddressPill
                  address={address}
                  className="justify-center w-44"
                />
              )}
              {isConnected && !isChainIdSupported(chain?.id) && (
                <Button disabled icon={faWaveSquare} variant="outline">
                  Unsupported Network
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-center w-full gap-5">
            <div className="flex items-center justify-center w-8 h-8 text-xl font-bold rounded-full bg-zinc-300 text-zinc-800">
              2
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
