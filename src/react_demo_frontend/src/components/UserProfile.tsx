import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "../ic/useSession";

export default function UserProfile() {
  const { handleErrors, actor } = useSession();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (!handleErrors || !actor) return;
    setSaving(true);
    const response = await handleErrors(() =>
      actor.save_my_profile({
        name,
        avatar_url: avatarUrl,
      })
    );
    if ("Ok" in response) {
      alert(response.Ok);
    } else {
      console.error(response.Err);
    }
    setSaving(false);
  }

  return (
    <div className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 px-5 drop-shadow-xl rounded-3xl flex flex-col items-center">
      <div className="flex flex-col items-center w-full gap-10 p-8">
        <div className="text-2xl font-bold">User Profile</div>
        <form className="flex flex-col items-center gap-5" onSubmit={submit}>
          Name
          <input
            name="name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
          Avatar URL
          <input
            name="avatar_url"
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Avatar URL"
            type="text"
            value={avatarUrl}
          />
          <button type="submit">
            {saving ? <FontAwesomeIcon icon={faCircleNotch} spin /> : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
