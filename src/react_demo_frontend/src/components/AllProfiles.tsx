import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "../ic/useSession";
import { UserProfile } from "../../../declarations/react_demo_backend/react_demo_backend.did";

export default function AllProfiles() {
  const [sessions, setSessions] = useState<[string, UserProfile][]>([]);
  const [loading, setLoading] = useState(true);
  const { handleErrors, actor } = useSession();

  useEffect(() => {
    if (!handleErrors || !actor) return;
    (async () => {
      const response = await handleErrors(() => actor.list_profiles());
      if ("Ok" in response) {
        setSessions(response.Ok);
      } else {
        console.error(response.Err);
      }
      setLoading(false);
    })();
  }, [handleErrors, actor]);

  return (
    <div className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 px-5 drop-shadow-xl rounded-3xl flex flex-col items-center">
      <div className="flex flex-col items-center w-full gap-10 p-8">
        <div className="text-2xl font-bold">User Profiles</div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {loading && (
              <FontAwesomeIcon className="w-4 h-4" icon={faCircleNotch} spin />
            )}
            {sessions.map((session) => JSON.stringify(session[1]))}
          </div>
        </div>
      </div>
    </div>
  );
}
