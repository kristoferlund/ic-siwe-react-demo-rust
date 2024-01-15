import AllProfiles from "./components/profile/AllProfiles";
import EditProfile from "./components/profile/EditProfile";
import Header from "./components/header/Header";
import { NoProfileMessage } from "./components/profile/NoProfileMessage";
import GitHubIcon from "./components/GitHubIcon";

function App() {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <div className="flex flex-col items-center w-full gap-10 p-5">
        <div className="h-5 md:h-28" />
        <NoProfileMessage />
        <EditProfile className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 drop-shadow-xl rounded-3xl flex flex-col items-center px-5 md:px-24 py-8" />
        <AllProfiles />
        <GitHubIcon />
      </div>
    </div>
  );
}

export default App;
