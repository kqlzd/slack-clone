import { Session } from "@supabase/auth-js";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { Chat } from "./components/Chat/Chat";
import { Auth } from "./components/Auth/Auth";

function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{session ? <Chat session={session} /> : <Auth />}</>;
}

export default App;
