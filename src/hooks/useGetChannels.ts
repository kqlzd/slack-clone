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

    const subscription = supabase
      .channel("channels")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "channels" },
        (payload) => {
          setChannels((prev) => [...prev, payload.new as Channel]);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "channels" },
        (payload) => {
          setChannels((prev) => prev.filter((ch) => ch.id !== payload.old.id));
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { channels, activeChannel, setActiveChannel };
};
