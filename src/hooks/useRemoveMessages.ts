import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

export const useRemoveMessages = (session: Session | null) => {
  const removeMessage = async (id: string) => {
    if (!session) return;

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (error) console.error(error);
  };
  return { removeMessage };
};
