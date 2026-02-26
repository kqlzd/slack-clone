import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Message, Channel } from "../models/api";

export const useGetMessages = (activeChannel: Channel | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    if (!activeChannel) return;

    const getMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*, profiles(username)")
        .eq("channel_id", activeChannel.id)
        .order("created_at", { ascending: true });

      if (error) console.error(error);
      if (data) setMessages(data);
    };

    getMessages();
    const subscription = supabase
      .channel(`messages:${activeChannel.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `channel_id=eq.${activeChannel.id}`,
        },
        async (payload) => {
          const newMsg = payload.new as Message;
          // Fetch profile data for the new message
          const { data: profileData } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", newMsg.user_id)
            .single();

          const messageWithProfile: Message = {
            ...newMsg,
            profiles: profileData,
          };
          setMessages((prev) => [...prev, messageWithProfile]);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== payload.old.id),
          );
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChannel]);

  return { messages, setNewMessage, newMessage };
};
