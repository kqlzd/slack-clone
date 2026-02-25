import { supabase } from "../lib/supabase";

export const useRemoveChannel = () => {
  const removeChannel = async (id: string) => {
    const { error } = await supabase.from("channels").delete().eq("id", id);

    if (error) console.error(error);
  };
  return { removeChannel };
};
