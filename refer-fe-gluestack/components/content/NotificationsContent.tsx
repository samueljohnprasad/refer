import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FlatList } from "react-native";
import { Heading } from "../ui/heading";
import { Icon, BellIcon } from "../ui/icon";

const NotificationsContent = () => {
  const notifications = Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    title: `Notification ${i + 1}`,
    message: `This is a sample notification message ${i + 1}.`,
    time: `${i + 1}h ago`,
    read: i % 2 === 0,
    type: ["message", "referral", "connection", "job"][i % 4],
  }));

  return (
    <Box className="p-6">
      <Heading size="xl" className="mb-4">
        Notifications
      </Heading>
      <Text className="text-typography-600 mb-6">
        Stay updated with your network activity and job opportunities.
      </Text>

      <FlatList
        data={notifications}
        renderItem={({ item }) => (
          <Box
            className={`p-4 border border-primaryBorder rounded-lg mb-3 ${
              !item.read ? "bg-primary-50" : ""
            }`}
          >
            <Box className="flex-row">
              <Box className="mr-3 mt-1">
                <Icon as={BellIcon} size="md" color="black" />
              </Box>
              <Box className="flex-1">
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-sm text-typography-500 mt-1">
                  {item.message}
                </Text>
                <Text className="text-xs text-typography-400 mt-2">
                  {item.time}
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

export default NotificationsContent;
