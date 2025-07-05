import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FlatList } from "react-native";
import { Heading } from "../ui/heading";
import { Avatar, AvatarFallbackText } from "../ui/avatar";
import { Button, ButtonText } from "../ui/button";

const NetworkContent = () => {
  const connections = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: `Connection ${i + 1}`,
    initials: `${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(
      65 + ((i + 5) % 26)
    )}`,
    role: `${
      ["Software Engineer", "Product Manager", "UX Designer", "Data Scientist"][
        i % 4
      ]
    }`,
    company: `${
      ["Tech Corp", "Innovate Inc", "Design Labs", "Data Systems"][i % 4]
    }`,
    mutualConnections: Math.floor(Math.random() * 20) + 1,
    connected: i % 3 === 0,
  }));

  return (
    <Box className="p-6">
      <Heading size="xl" className="mb-4">
        Your Network
      </Heading>
      <Text className="text-typography-600 mb-6">
        Grow your professional network and find new opportunities.
      </Text>

      <FlatList
        data={connections}
        renderItem={({ item }) => (
          <Box className="p-4 border border-primaryBorder rounded-lg mb-3">
            <Box className="flex-row items-center">
              <Avatar size="md">
                <AvatarFallbackText>{item.initials}</AvatarFallbackText>
              </Avatar>
              <Box className="ml-3 flex-1">
                <Text className="font-medium">{item.name}</Text>
                <Text className="text-sm text-typography-500">
                  {item.role} at {item.company}
                </Text>
                <Text className="text-xs text-typography-400 mt-1">
                  {item.mutualConnections} mutual connections
                </Text>
              </Box>
              <Button
                size="sm"
                variant={item.connected ? "outline" : "solid"}
                className={item.connected ? "border-primary-600" : ""}
              >
                <ButtonText>
                  {item.connected ? "Connected" : "Connect"}
                </ButtonText>
              </Button>
            </Box>
          </Box>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Box>
  );
};

export default NetworkContent;
