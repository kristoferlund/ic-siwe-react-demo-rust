import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { useGlobalState } from "../../state";
import { useSession } from "../../ic/useSession";

type SessionDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function SessionDialog({
  isOpen,
  setIsOpen,
}: SessionDialogProps) {
  const { logout } = useSession();

  // Global state
  const session = useGlobalState((state) => state.session);

  if (!session) return null;

  const createdAt = new Date(Number(session?.created_at / 1000000n));
  const maxAge = Number(session?.max_age / 1000000n);
  const expiresAt = new Date(createdAt.getTime() + maxAge);

  return (
    <Dialog className="max-w-sm" isOpen={isOpen} setIsOpen={setIsOpen}>
      <HeadlessDialog.Title>Session</HeadlessDialog.Title>
      <div className="text-zinc-400 px-4 py-2 text-xs rounded-lg bg-zinc-900/50">
        <pre>
          Created: {createdAt.toLocaleDateString()}{" "}
          {createdAt.toLocaleTimeString()}
          <br />
          Expires: {expiresAt.toLocaleDateString()}{" "}
          {expiresAt.toLocaleTimeString()}
        </pre>
      </div>
      <div className="flex w-full justify-center gap-5">
        <Button onClick={() => setIsOpen(false)} variant="outline">
          Close
        </Button>
        <Button onClick={logout}>Logout</Button>
      </div>
    </Dialog>
  );
}
