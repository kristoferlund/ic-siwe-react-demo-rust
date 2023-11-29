import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "../ic/session.type";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { react_demo_backend } from "../../../declarations/react_demo_backend";
import { useSession } from "../ic/useSession";
import AddressPill from "./AddressPill";

export default function ActiveSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleErrors } = useSession();

  useEffect(() => {
    if (!handleErrors) return;
    (async () => {
      const response = await handleErrors(() =>
        react_demo_backend.list_active_sessions()
      );
      if ("Ok" in response) {
        setSessions(response.Ok);
      } else {
        console.error(response.Err);
      }
      setLoading(false);
    })();
  }, [handleErrors]);

  return (
    <div className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 px-5 drop-shadow-xl rounded-3xl flex flex-col items-center">
      <div className="flex flex-col items-center w-full gap-10 p-8">
        <div className="text-2xl font-bold">Active Sessions</div>
        <div className="flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {loading && (
              <FontAwesomeIcon className="w-4 h-4" icon={faCircleNotch} spin />
            )}
            {sessions.map((session) => (
              <AddressPill address={session.address} key={session.address} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
