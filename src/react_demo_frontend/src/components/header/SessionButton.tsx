import Button from "../ui/Button";
import SessionDialog from "./SessionDialog";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useAccount } from "wagmi";
import { useIdentity } from "../../ic/useIdentity";
import { useState } from "react";

export default function SessionButton() {
  const { identity } = useIdentity();
  const { isConnected } = useAccount();

  // Local state
  const [isOpen, setIsOpen] = useState(false);

  if (!identity || !isConnected) return null;

  return (
    <>
      <Button
        className="w-10 h-10 rounded-full"
        icon={faUser}
        onClick={() => setIsOpen(true)}
        variant="dark"
      ></Button>
      <SessionDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
