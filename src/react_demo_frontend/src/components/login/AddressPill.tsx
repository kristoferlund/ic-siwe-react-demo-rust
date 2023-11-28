import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pill from "../ui/Pill";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
import { useAccount } from "wagmi";

export default function AddressPill() {
  const { address } = useAccount();

  if (!address) return null;

  return (
    <Pill className="justify-center w-44">
      <FontAwesomeIcon className="w-3 h-3" icon={faEthereum} />
      {address?.slice(0, 6) + "..." + address?.slice(-4)}
    </Pill>
  );
}
