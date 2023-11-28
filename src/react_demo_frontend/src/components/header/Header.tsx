import EthButton from "./EthButton";
import IdentityButton from "./IdentityButton";
import SessionButton from "./SessionButton";

export default function Header() {
  return (
    <div className="flex justify-between w-full p-5">
      <div className="text-xl font-bold">
        Internet Computer + React + Sign In With Ethereum
      </div>
      <div className="flex items-center gap-5">
        <IdentityButton />
        <EthButton />
        <SessionButton />
      </div>
    </div>
  );
}
