import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pill from "./ui/Pill";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";

type AddressPillProps = {
  address?: string;
  className?: string;
};

export default function AddressPill({ address, className }: AddressPillProps) {
  if (!address) return null;
  return (
    <Pill className={className}>
      <FontAwesomeIcon className="w-3 h-3" icon={faEthereum} />
      {address?.slice(0, 6) + "..." + address?.slice(-4)}
    </Pill>
  );
}
