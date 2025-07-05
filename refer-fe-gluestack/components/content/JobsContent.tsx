import React from "react";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { FlatList } from "react-native";
import { Heading } from "../ui/heading";
import { Input, InputField, InputIcon } from "../ui/input";
import { SearchIcon } from "../ui/icon";

const JobsContent = () => {
  const jobListings = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    title: `${
      ["Software Engineer", "Product Manager", "UX Designer", "Data Scientist"][
        i % 4
      ]
    } ${i + 1}`,
    company: `${
      ["Tech Corp", "Innovate Inc", "Design Labs", "Data Systems"][i % 4]
    }`,
    location: `${["San Francisco", "New York", "Remote", "Seattle"][i % 4]}`,
    salary: `$${100 + i * 10}k - $${150 + i * 10}k`,
  }));

  return (
    <Box className="p-6">
      <Heading size="xl" className="mb-4">
        Job Listings
      </Heading>

      <Box className="mb-6">
        <Input>
          <InputField placeholder="Search jobs..." />
          <InputIcon>
            <SearchIcon />
          </InputIcon>
        </Input>
      </Box>

      <FlatList
        data={jobListings}
        renderItem={({ item }) => (
          <Box className="p-4 border border-primaryBorder rounded-lg mb-3">
            <Text className="font-medium text-lg">{item.title}</Text>
            <Text className="text-primary-700 font-medium mt-1">
              {item.company}
            </Text>
            <Box className="flex-row justify-between mt-2">
              <Text className="text-sm text-typography-500">
                {item.location}
              </Text>
              <Text className="text-sm text-typography-500">{item.salary}</Text>
            </Box>
          </Box>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Box>
  );
};

export default JobsContent;
