import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";

import Button from "../ui/Button";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { faWaveSquare } from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "wagmi";

export default function EthButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();

  const handleClick = () => {
    if (isConnected) {
      openAccountModal?.();
    } else {
      openConnectModal?.();
    }
  };

  const buttonIcon = () => {
    if (isConnecting) {
      return faWaveSquare;
    } else if (isConnected) {
      return faEthereum;
    } else {
      return faWaveSquare;
    }
  };

  const buttonText = () => {
    if (isConnecting) {
      return "Connecting...";
    }
    if (isConnected) {
      return address?.slice(0, 5) + "..." + address?.slice(-3);
    }
    return "Connect";
  };

  return (
    <>
      <Button icon={buttonIcon()} onClick={handleClick} variant="dark">
        {buttonText()}
      </Button>
    </>
  );
}
