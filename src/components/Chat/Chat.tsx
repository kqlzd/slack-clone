import { Flex, Box, Heading, Text, Input, Button } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

interface Props {
  session: Session;
}
interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}
interface Channel {
  id: string;
  name: string;
}

export const Chat = ({ session }: Props) => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

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

  useEffect(() => {
    if (!activeChannel) return;

    const getMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
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
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [activeChannel]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChannel) return;

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      channel_id: activeChannel.id,
      user_id: session.user.id,
    });

    if (error) console.error(error);
    setNewMessage("");
  };
  return (
    <Flex height="100vh">
      <Box
        bgColor="blue.700"
        color="white"
        width="250px"
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Heading size="md"># {activeChannel?.name}</Heading>

          {channels.map((channel) => (
            <Text
              key={channel.id}
              p={2}
              borderRadius="md"
              bg={activeChannel?.id === channel.id ? "blue.600" : "transparent"}
              cursor="pointer"
              onClick={() => setActiveChannel(channel)}
            >
              # {channel.name}
            </Text>
          ))}
        </Box>
        <Box>
          <Text fontSize="sm" mb={2}>
            email
          </Text>
          <Button size="sm" width="full">
            Çıxış
          </Button>
        </Box>
      </Box>

      <Flex flex={1} flexDirection="column">
        <Box p={4} borderBottom="1px solid #eee">
          <Heading size="md"># {activeChannel?.name}</Heading>
        </Box>
        <Box flex={1} p={4} overflowY="auto">
          {messages.map((msg) => (
            <Box key={msg.id} mb={3}>
              <Text fontSize="sm" color="gray.500">
                {msg.user_id}
              </Text>
              <Text>{msg.content}</Text>
            </Box>
          ))}
        </Box>
        <Flex p={4} gap={2} borderTop="1px solid #eee">
          <Input
            placeholder="Mesaj yaz..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <Button onClick={sendMessage}>Göndər</Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
