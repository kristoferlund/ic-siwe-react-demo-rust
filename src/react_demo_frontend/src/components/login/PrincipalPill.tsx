import Pill from "../ui/Pill";
import { useIdentity } from "ic-eth-identity";

export default function PrincipalPill() {
  const { identity } = useIdentity();

  const principal = identity?.getPrincipal().toString();

  if (!principal) return null;

  return (
    <Pill className="justify-center w-44">
      <img alt="ic" className="w-4 h-4" src="/ic.svg" />
      {principal?.slice(0, 6) + "..." + principal?.slice(-4)}
    </Pill>
  );
}
