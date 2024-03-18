import { useAccount, useDisconnect, useEnsName } from "wagmi";

import Button from "./ui/Button";
import Dialog from "./ui/Dialog";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { shortenEthAddress } from "../eth/utils/shortenEthAddress";

export function AccountDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  const { data: ensName } = useEnsName({ address, chainId: 1 });

  return (
    <Dialog className="w-80" isOpen={isOpen} setIsOpen={setIsOpen}>
      <HeadlessDialog.Title className="flex justify-between">
        Account
      </HeadlessDialog.Title>

      <Button
        className="w-full"
        icon={faRightFromBracket}
        onClick={() => {
          setIsOpen(false);
          disconnect();
        }}
        variant="outline"
      >
        {ensName ?? shortenEthAddress(address)}
      </Button>
    </Dialog>
  );
}
