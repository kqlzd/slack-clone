import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Channel } from "../models/api";

export const useGetChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const getChannels = async () => {
      const { data, error } = await supabase.from("channels").select("*");
      if (error) console.error(error);
      if (data) {
        setChannels(data);
        setActiveChannel(data[0]);
      }
    };
    getChannels();
  }, []);

  return { channels, activeChannel, setActiveChannel };
};
