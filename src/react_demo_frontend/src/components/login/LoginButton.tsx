import { useAccount, useNetwork } from "wagmi";

import Button from "../ui/Button";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { isChainIdSupported } from "../../wagmi/is-chain-id-supported";
import { useIdentity } from "ic-eth-identity";
import { useSession } from "../../ic/useSession";

export default function LoginButton() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { identity } = useIdentity();
  const { login, isLoggingIn } = useSession();

  const text = isLoggingIn ? "Signing in" : "Sign in";

  const icon = isLoggingIn ? faCircleNotch : undefined;

  const disabled =
    !isChainIdSupported(chain?.id) || isLoggingIn || !identity || !isConnected;

  return (
    <Button
      className="w-44"
      disabled={disabled}
      icon={icon}
      onClick={login}
      spin
    >
      {text}
    </Button>
  );
}
