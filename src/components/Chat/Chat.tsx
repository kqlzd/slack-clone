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
        bgColor="#3F0E40"
        color="white"
        width="260px"
        p={0}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          <Box p={4} borderBottom="1px solid #522653">
            <Heading size="md" fontWeight="bold">
              Slack Clone
            </Heading>
          </Box>

          <Box p={2}>
            <Text fontSize="sm" color="whiteAlpha.700" px={2} py={2}>
              Kanallar
            </Text>
            {channels.map((channel) => (
              <Text
                key={channel.id}
                px={3}
                py={1.5}
                borderRadius="md"
                bg={
                  activeChannel?.id === channel.id ? "#1164A3" : "transparent"
                }
                _hover={{
                  bg: activeChannel?.id === channel.id ? "#1164A3" : "#350D36",
                }}
                cursor="pointer"
                fontSize="15px"
                onClick={() => setActiveChannel(channel)}
              >
                # {channel.name}
              </Text>
            ))}
          </Box>
        </Box>

        <Box p={3} borderTop="1px solid #522653">
          <Text fontSize="sm" mb={2} color="whiteAlpha.800">
            {session.user.email}
          </Text>
          <Button
            size="sm"
            width="full"
            bg="#611f69"
            color="white"
            _hover={{ bg: "#4a154b" }}
            onClick={() => supabase.auth.signOut()}
          >
            Çıxış
          </Button>
        </Box>
      </Box>

      <Flex flex={1} flexDirection="column" bg="white">
        <Box p={4} borderBottom="1px solid #e0e0e0" bg="white">
          <Heading size="md" fontWeight="bold" color="#1d1c1d">
            # {activeChannel?.name}
          </Heading>
        </Box>

        <Box flex={1} p={4} overflowY="auto" bg="#f8f8f8">
          {messages.map((msg) => (
            <Box
              key={msg.id}
              mb={4}
              p={2}
              _hover={{ bg: "#f0f0f0" }}
              borderRadius="md"
            >
              <Text fontSize="sm" fontWeight="bold" color="#1d1c1d">
                {session?.user?.email}
              </Text>
              <Text color="#1d1c1d">{msg.content}</Text>
            </Box>
          ))}
        </Box>

        <Box p={4} borderTop="1px solid #e0e0e0" bg="white">
          <Flex
            gap={2}
            border="1px solid #868686"
            borderRadius="lg"
            p={2}
            _focusWithin={{
              borderColor: "#1264a3",
              boxShadow: "0 0 0 1px #1264a3",
            }}
          >
            <Input
              placeholder={`#${activeChannel?.name || "kanal"} kanalına mesaj yaz...`}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              border="none"
              _focus={{ boxShadow: "none" }}
            />
            <Button
              onClick={sendMessage}
              bg="#007a5a"
              color="white"
              _hover={{ bg: "#148567" }}
              _disabled={{ bg: "#ccc" }}
              disabled={!newMessage.trim()}
            >
              Göndər
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  );
};
