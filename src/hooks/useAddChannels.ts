import { supabase } from "../lib/supabase";

export const useAddChannels = () => {
  const handleAddChannel = async (name: string) => {
    const { error } = await supabase
      .from("channels")
      .insert({ name: name.toLowerCase() });

    if (error) console.error(error);
  };
  return { handleAddChannel };
};
