import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";

import Button from "../ui/Button";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useIdentity } from "ic-eth-identity";

export default function IdentityButton() {
  const { address, isConnected } = useAccount();
  const { signMessage, data: signature, isError } = useSignMessage();
  const { createMessage, create: createIdentity } = useIdentity();

  // Local state
  const [isCreatingIdentity, setIsCreatingIdentity] = useState(false);

  // Generate identity message and sign it.
  const handleClick = () => {
    if (!address) return null;
    const indetityMessage = createMessage(window.location.hostname, address);
    setIsCreatingIdentity(true);
    signMessage({ message: indetityMessage });
  };

  // User has signed the identity message.
  useEffect(() => {
    if (!address || !signature) return;
    if (isCreatingIdentity) {
      createIdentity?.(address, signature);
      setIsCreatingIdentity(false);
    }
  }, [
    address,
    signature,
    isCreatingIdentity,
    createIdentity,
    setIsCreatingIdentity,
  ]);

  // Handle signature rejections
  useEffect(() => {
    if (isError) {
      setIsCreatingIdentity(false);
    }
  }, [isError, setIsCreatingIdentity]);

  const text = isCreatingIdentity ? "Creating identity" : "Create identity";

  const disabled = isCreatingIdentity || !isConnected;

  const icon = isCreatingIdentity ? faCircleNotch : undefined;

  return (
    <Button
      className="w-44"
      disabled={disabled}
      icon={icon}
      onClick={() => handleClick()}
      spin={isCreatingIdentity}
    >
      {!isCreatingIdentity && (
        <img alt="ic" className="w-4 h-4 inline-block mr-1" src="/ic.svg" />
      )}
      {text}
    </Button>
  );
}
