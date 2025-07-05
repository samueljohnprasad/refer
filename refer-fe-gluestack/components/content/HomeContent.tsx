import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FlatList } from "react-native";
import { Heading } from "../ui/heading";

const HomeContent = () => {
  return (
    <Box className="p-6">
      <Heading size="xl" className="mb-4">
        Home Dashboard
      </Heading>
      <Text className="text-typography-600 mb-6">
        Welcome to your personalized dashboard. Here you can see an overview of
        your activity.
      </Text>
      <FlatList
        data={Array.from({ length: 10 }).map((_, i) => ({
          id: i,
          title: `Dashboard Item ${i + 1}`,
        }))}
        renderItem={({ item }) => (
          <Box className="p-4 border border-primaryBorder rounded-lg mb-3">
            <Text className="font-medium">{item.title}</Text>
            <Text className="text-sm text-typography-500 mt-1">
              This is a sample dashboard item with some content.
            </Text>
          </Box>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Box>
  );
};

export default HomeContent;
