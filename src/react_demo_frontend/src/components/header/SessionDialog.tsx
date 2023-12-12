import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import EditProfile from "../profile/EditProfile";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { useIdentity } from "../../ic/useIdentity";

type SessionDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

function arrayBufferToHex(arrayBuffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(arrayBuffer);
  return Array.from(byteArray, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
}

export default function SessionDialog({
  isOpen,
  setIsOpen,
}: SessionDialogProps) {
  const { clear, identity, delegationChain } = useIdentity();

  if (!identity) return null;

  return (
    <Dialog className="max-w-xl" isOpen={isOpen} setIsOpen={setIsOpen}>
      <HeadlessDialog.Title>Session</HeadlessDialog.Title>
      <div className="px-4 py-2 text-xs rounded-lg text-zinc-400 bg-zinc-900/50">
        <pre>
          {delegationChain?.delegations.map((delegation) => {
            const pubKey = arrayBufferToHex(delegation.delegation.pubkey);
            const expiration = new Date(
              Number(delegation.delegation.expiration / 1000000n)
            );
            return (
              <div key={pubKey}>
                pubkey: {pubKey.slice(0, 8)}...{pubKey.slice(-8)}
                <br />
                expiration: {expiration.toLocaleDateString()}{" "}
                {expiration.toLocaleTimeString()}
                <br />
              </div>
            );
          })}
        </pre>
      </div>
      <EditProfile
        allwaysShow
        className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 drop-shadow-xl rounded-3xl flex flex-col items-center p-8"
      />

      <div className="flex justify-center w-full gap-5">
        <Button onClick={() => setIsOpen(false)} variant="outline">
          Close
        </Button>
        <Button onClick={clear}>Logout</Button>
      </div>
    </Dialog>
  );
}
