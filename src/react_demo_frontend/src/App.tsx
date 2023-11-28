import ActiveSessions from "./components/ActiveSessions";
import Header from "./components/header/Header";

function App() {
  return (
    <div className="w-full items-center flex flex-col">
      <Header />
      <div className="h-28" />
      <ActiveSessions />
    </div>
  );
}

export default App;
