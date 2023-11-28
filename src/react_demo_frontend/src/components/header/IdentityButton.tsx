import Button from "../ui/Button";
import PrincipalDialog from "./PrincipalDialog";
import { useAccount } from "wagmi";
import { useIdentity } from "ic-eth-identity";
import { useState } from "react";

export default function IdentityButton() {
  const { identity } = useIdentity();
  const { isConnected } = useAccount();

  const [isOpen, setIsOpen] = useState(false);

  if (!identity || !isConnected) return null;

  let principal = identity.getPrincipal().toString();
  principal = principal.slice(0, 4) + "..." + principal.slice(-2);

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="dark">
        <img
          alt="Internet Computer"
          className="w-4 h-4 inline-block mr-1"
          src="/ic.svg"
        />
        {principal}
      </Button>
      <PrincipalDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
