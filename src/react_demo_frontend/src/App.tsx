import ActiveSessions from "./components/ActiveSessions";
import AllProfiles from "./components/AllProfiles";
import UserProfile from "./components/UserProfile";
import Header from "./components/header/Header";

function App() {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <div className="h-28" />
      <ActiveSessions />
      <UserProfile />
      <AllProfiles />
    </div>
  );
}

export default App;
