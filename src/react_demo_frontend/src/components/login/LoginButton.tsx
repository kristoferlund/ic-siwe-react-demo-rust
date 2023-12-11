import { useAccount, useNetwork } from "wagmi";

import Button from "../ui/Button";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { isChainIdSupported } from "../../wagmi/is-chain-id-supported";
import { useIdentity } from "../../ic/useIdentity";

export default function LoginButton() {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { login, isLoggingIn } = useIdentity();

  const text = isLoggingIn ? "Signing in" : "Sign in";

  const icon = isLoggingIn ? faCircleNotch : undefined;

  const disabled =
    !isChainIdSupported(chain?.id) || isLoggingIn || !isConnected;

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
