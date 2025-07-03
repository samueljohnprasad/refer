import React from "react";
import DocumentData from "@/assets/Icons/DocumentData";
import LightBulbPerson from "@/assets/Icons/LightbulbPerson";
import Rocket from "@/assets/Icons/Rocket";
import Logo from "@/assets/Icons/Logo";
import { Box } from "@/components/ui/box";
import { FlatList, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

const FeatureCard = ({ iconSvg: IconSvg, name, desc }: any) => {
  return (
    <Box
      className="flex-column border border-w-1 border-outline-700 md:flex-1 m-2 p-4 rounded"
      key={name}
    >
      <Box className="items-center flex flex-row">
        <Text>
          <IconSvg />
        </Text>
        <Text className="text-typography-white font-medium ml-2 text-xl">
          {name}
        </Text>
      </Box>
      <Text className="text-typography-400 mt-2">{desc}</Text>
    </Box>
  );
};

export default function Home() {
  return (
    <Box className="w-full h-full">
      <Box className="lg:w-[1200px] w-full min-h-screen mx-auto flex font-body flex-row  ">
        <Box className="w-[212px] flex-col flex-shrink-0 fixed h-screen pb-2 lg:flex justify-between hidden"></Box>
        <Box className="w-full lg:pl-[212px]  border-primaryBorder flex flex-row border-r border-primaryBorder">
          <Box className="lg:w-[640px] w-full h-full  pt-14 pb-20 lg:border-r lg:border-l box-border">
            <Box className="h-14 z-60  border-b border-primaryBorder box-border lg:max-w-[638px] lg:w-[638px] fixed top-0 bg-gray-00 py-4  sm:px-6 lg:left-auto lg:right-auto flex items-center hidden lg:flex justify-center left-12 right-12 px-2"></Box>

            <FlatList
              className="px-6"
              data={Array.from({ length: 300 })}
              renderItem={({ item }) => (
                <FeatureCard
                  key={item as string}
                  iconSvg={Rocket}
                  name="Deploy"
                  desc="Instantly drop your gluestack site to a shareable URL with vercel."
                />
              )}
            />
          </Box>
          <Box>
            <Box className="lg:w-[349px] border-b flex h-14 top-0 w-full relative z-50 ">
              <Box className="lg:w-[349px] z-10  -mt-px fixed top-0 bg-gray-00 lg:px-6 flex-shrink-0 lg:border-b border-primaryBorder"></Box>
            </Box>
            <Box className="bg-red-50 max-w-348 bg-gray-00 duration-200 h-full min-h-screen fixed top-14 px-6 py-6 translate-x-full lg:block lg:w-full lg:translate-x-0 right-0 lg:right-auto overflow-y-auto hide-scrollbar pb-24"></Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
