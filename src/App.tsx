import { Auth } from "./pages/Auth/Auth";
import { Chat } from "./pages/Chat/Chat";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { session } = useAuth();

  return <>{session ? <Chat session={session} /> : <Auth />}</>;
}

export default App;
