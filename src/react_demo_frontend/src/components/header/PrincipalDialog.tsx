import Button from "../ui/Button";
import Dialog from "../ui/Dialog";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { useGlobalState } from "../../state";
import { useIdentity } from "ic-eth-identity";
import { useSession } from "../../ic/useSession";

type SessionDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function PrincipalDialog({
  isOpen,
  setIsOpen,
}: SessionDialogProps) {
  const { logout } = useSession();
  const { identity } = useIdentity();

  // Global state
  const session = useGlobalState((state) => state.session);

  if (!session) return null;

  return (
    <Dialog className="max-w-lg" isOpen={isOpen} setIsOpen={setIsOpen}>
      <img
        alt="Internet Computer"
        className="w-12 h-12 inline-block"
        src="/ic.svg"
      />
      <HeadlessDialog.Title>Internet Computer Identity</HeadlessDialog.Title>
      <div className="text-zinc-400 px-4 py-2 text-xs rounded-lg bg-zinc-900/50">
        <pre>{identity?.getPrincipal().toString()}</pre>
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
