import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FlatList } from "react-native";
import { Heading } from "../ui/heading";
import { Badge, BadgeText } from "../ui/badge";

const ReferralsContent = () => {
  const referrals = Array.from({ length: 6 }).map((_, i) => ({
    id: i,
    name: `John Doe ${i + 1}`,
    position: `${
      ["Software Engineer", "Product Manager", "UX Designer"][i % 3]
    }`,
    company: `${["Tech Corp", "Innovate Inc", "Design Labs"][i % 3]}`,
    status: ["Pending", "Accepted", "Rejected", "In Review"][i % 4],
  }));

  return (
    <Box className="p-6">
      <Heading size="xl" className="mb-4">
        Referrals Dashboard
      </Heading>
      <Text className="text-typography-600 mb-6">
        Track and manage your referrals. Connect with professionals in your
        network.
      </Text>

      <FlatList
        data={referrals}
        renderItem={({ item }) => (
          <Box className="p-4 border border-primaryBorder rounded-lg mb-3">
            <Box className="flex-row justify-between items-center">
              <Text className="font-medium text-lg">{item.name}</Text>
              <Badge
                className={
                  item.status === "Accepted"
                    ? "bg-green-100"
                    : item.status === "Rejected"
                    ? "bg-red-100"
                    : item.status === "In Review"
                    ? "bg-yellow-100"
                    : "bg-gray-100"
                }
              >
                <BadgeText
                  className={
                    item.status === "Accepted"
                      ? "text-green-800"
                      : item.status === "Rejected"
                      ? "text-red-800"
                      : item.status === "In Review"
                      ? "text-yellow-800"
                      : "text-gray-800"
                  }
                >
                  {item.status}
                </BadgeText>
              </Badge>
            </Box>
            <Text className="text-primary-700 mt-1">
              {item.position} at {item.company}
            </Text>
            <Text className="text-sm text-typography-500 mt-2">
              Referred on {new Date().toLocaleDateString()}
            </Text>
          </Box>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Box>
  );
};

export default ReferralsContent;
