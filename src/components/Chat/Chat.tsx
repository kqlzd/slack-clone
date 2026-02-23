import { Flex, Box, Heading, Text, Input, Button } from "@chakra-ui/react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../lib/supabase";
import { useGetChannels } from "../../hooks/useGetChannels";
import { useGetMessages } from "../../hooks/useGetMessages";

interface Props {
  session: Session;
}

export const Chat = ({ session }: Props) => {
  const { channels, activeChannel, setActiveChannel } = useGetChannels();
  const { messages, setNewMessage, newMessage } = useGetMessages(activeChannel);

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
