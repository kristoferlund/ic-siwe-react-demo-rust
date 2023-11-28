import ActiveSessions from "./components/ActiveSessions";
import Header from "./components/header/Header";

function App() {
  return (
    <div className="flex flex-col items-center w-full">
      <Header />
      <div className="h-28" />
      <ActiveSessions />
    </div>
  );
}

export default App;
