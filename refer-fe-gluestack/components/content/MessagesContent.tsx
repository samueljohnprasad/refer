import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FlatList } from "react-native";
import { Heading } from "../ui/heading";
import { Avatar, AvatarFallbackText } from "../ui/avatar";

const MessagesContent = () => {
  const messages = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    sender: `Contact ${i + 1}`,
    initials: `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(
      65 + ((i + 5) % 26)
    )}`,
    message: `This is a sample message ${
      i + 1
    }. Click to view the conversation.`,
    time: `${i + 1}h ago`,
    unread: i % 3 === 0,
  }));

  return (
    <Box className="p-6">
      <Heading size="xl" className="mb-4">
        Messages
      </Heading>
      <Text className="text-typography-600 mb-6">
        Your conversations with connections and referrals.
      </Text>

      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Box
            className={`p-4 border border-primaryBorder rounded-lg mb-3 ${
              item.unread ? "bg-primary-50" : ""
            }`}
          >
            <Box className="flex-row items-center">
              <Avatar>
                <AvatarFallbackText>{item.initials}</AvatarFallbackText>
              </Avatar>
              <Box className="ml-3 flex-1">
                <Box className="flex-row justify-between items-center">
                  <Text className="font-medium">{item.sender}</Text>
                  <Text className="text-xs text-typography-500">
                    {item.time}
                  </Text>
                </Box>
                <Text
                  className={`text-sm mt-1 ${
                    item.unread
                      ? "text-typography-900 font-medium"
                      : "text-typography-500"
                  }`}
                  numberOfLines={1}
                >
                  {item.message}
                </Text>
              </Box>
            </Box>
          </Box>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Box>
  );
};

export default MessagesContent;
