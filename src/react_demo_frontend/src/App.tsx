import ActiveSessions from "./components/ActiveSessions";
import AllProfiles from "./components/profile/AllProfiles";
import EditProfile from "./components/profile/EditProfile";
import Header from "./components/header/Header";

function App() {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <div className="flex flex-col items-center w-full gap-10">
        <div className="h-28" />
        <EditProfile className="w-full max-w-2xl border-zinc-700/50 border-[1px] bg-zinc-900 drop-shadow-xl rounded-3xl flex flex-col items-center px-24 py-8" />
        <ActiveSessions />
        <AllProfiles />
      </div>
    </div>
  );
}

export default App;
