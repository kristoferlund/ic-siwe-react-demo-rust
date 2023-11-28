import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Session } from "../ic/session.type";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { react_demo_backend } from "../../../declarations/react_demo_backend";
import { useSession } from "../ic/useSession";

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
      <div className="flex flex-col items-center gap-10 p-8 w-full">
        <div className="text-4xl font-bold">Active Sessions</div>
        <div className="flex flex-col gap-5 items-center">
          <div className="text-xl font-bold flex items-center gap-2">
            {loading && (
              <FontAwesomeIcon className="w-4 h-4" icon={faCircleNotch} spin />
            )}
            <pre className="text-zinc-400">
              {sessions.map((session) => (
                <div key={session.address}>{session.address}</div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
