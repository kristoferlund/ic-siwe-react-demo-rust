import { actorContext, useActor } from "../../main";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileCard from "./ProfileCard";
import { UserProfile } from "../../../../declarations/react_demo_backend/react_demo_backend.did";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

export default function AllProfiles() {
  const [profiles, setProfiles] = useState<[string, UserProfile][]>([]);
  const [loading, setLoading] = useState(true);
  const { actor } = useActor(actorContext);

  useEffect(() => {
    if (!actor) return;
    (async () => {
      const response = await actor.list_profiles();
      if (response && "Ok" in response) {
        setProfiles(response.Ok);
      }
      setLoading(false);
    })();
  }, [actor]);

  return (
    <div className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 px-5 drop-shadow-xl rounded-3xl flex flex-col items-center">
      <div className="flex flex-col items-center w-full gap-10 py-8 md:px-8">
        <div className="text-2xl font-bold">User Profiles</div>
        <div className="flex flex-col items-center gap-5">
          {loading && (
            <div className="flex flex-col items-center justify-center w-full h-64">
              <FontAwesomeIcon className="w-4 h-4" icon={faCircleNotch} spin />
            </div>
          )}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {profiles.map((p) => (
              <ProfileCard key={p[0]} principal={p[0]} profile={p[1]} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
