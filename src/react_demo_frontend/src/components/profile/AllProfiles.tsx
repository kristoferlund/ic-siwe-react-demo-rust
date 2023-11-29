import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "../../ic/useSession";
import { UserProfile } from "../../../../declarations/react_demo_backend/react_demo_backend.did";
import ProfileCard from "./ProfileCard";

export default function AllProfiles() {
  const [profiles, setProfiles] = useState<[string, UserProfile][]>([]);
  const [loading, setLoading] = useState(true);
  const { handleErrors, actor } = useSession();

  useEffect(() => {
    if (!handleErrors || !actor) return;
    (async () => {
      const response = await handleErrors(() => actor.list_profiles());
      if (response && "Ok" in response) {
        setProfiles(response.Ok);
      }
      setLoading(false);
    })();
  }, [handleErrors, actor]);

  return (
    <div className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 px-5 drop-shadow-xl rounded-3xl flex flex-col items-center">
      <div className="flex flex-col items-center w-full p-8 gap-10">
        <div className="text-2xl font-bold">User Profiles</div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-5">
            {loading && (
              <FontAwesomeIcon className="w-4 h-4" icon={faCircleNotch} spin />
            )}
            {profiles.map((session) => (
              <ProfileCard
                address={session[0]}
                key={session[0]}
                profile={session[1]}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
