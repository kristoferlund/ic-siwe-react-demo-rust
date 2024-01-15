import { useEffect, useState } from "react";

import { useActor } from "../../ic/Actors";
import { useAccount } from "wagmi";
import AddressPill from "../AddressPill";
import PrincipalPill from "../PrincipalPill";
import { useSiweIdentity } from "ic-use-siwe-identity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftRight } from "@fortawesome/free-solid-svg-icons";

export function NoProfileMessage() {
  const { actor } = useActor();
  const { address } = useAccount();
  const { identity } = useSiweIdentity();

  // Local state
  const [hasProfile, setHasProfile] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (!actor) return;
      const response = await actor.get_my_profile();
      if (response && "Ok" in response) {
        if (response.Ok.name === "No Name") {
          setHasProfile(false);
        }
      } else {
        setHasProfile(false);
      }
      setLoading(false);
    })();
  }, [actor]);

  if (loading || hasProfile) return null;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl gap-5 text-center">
      <div className="text-2xl font-bold">Welcome!</div>
      <div>
        You are logged in and have established a one to one link between your
        Ethereum address and your Internet Computer identity.
      </div>
      <div>
        <AddressPill address={address} className="inline-block bg-zinc-700" />
        <FontAwesomeIcon
          className="w-5 h-5 mx-3 text-zinc-500"
          icon={faLeftRight}
        />
        <PrincipalPill
          className="inline-block bg-zinc-700 "
          principal={identity?.getPrincipal().toString()}
        />
      </div>
      <div>Now, save your user profile!</div>
    </div>
  );
}
