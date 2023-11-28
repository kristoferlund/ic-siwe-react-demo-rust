import EthButton from "./EthButton";
import IdentityButton from "./IdentityButton";
import SessionButton from "./SessionButton";

export default function Header() {
  return (
    <div className="flex w-full p-5 justify-between">
      <div className="text-xl font-bold">
        Internet Computer + React + Sign In With Ethereum
      </div>
      <div className="flex gap-5 items-center">
        <IdentityButton />
        <EthButton />
        <SessionButton />
      </div>
    </div>
  );
}
