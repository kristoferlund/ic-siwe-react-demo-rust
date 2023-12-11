import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import EditProfile from "../profile/EditProfile";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { useIdentity } from "../../ic/useIdentity";

type SessionDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function SessionDialog({
  isOpen,
  setIsOpen,
}: SessionDialogProps) {
  const { clear, identity } = useIdentity();

  if (!identity) return null;

  // const createdAt = new Date(Number(session?.created_at / 1000000n));
  // const maxAge = Number(session?.max_age / 1000000n);
  // const expiresAt = new Date(createdAt.getTime() + maxAge);

  return (
    <Dialog className="max-w-xl" isOpen={isOpen} setIsOpen={setIsOpen}>
      <HeadlessDialog.Title>Session</HeadlessDialog.Title>
      <div className="px-4 py-2 text-xs rounded-lg text-zinc-400 bg-zinc-900/50">
        <pre>
          {/* Created: {createdAt.toLocaleDateString()}{" "}
          {createdAt.toLocaleTimeString()}
          <br />
          Expires: {expiresAt.toLocaleDateString()}{" "}
          {expiresAt.toLocaleTimeString()} */}
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
