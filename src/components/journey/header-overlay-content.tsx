import React, { useState } from "react";
import {
  LayoutChangeEvent,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import Svg, { Path, SvgProps } from "react-native-svg";

import { Flag } from "@/assets/icons";
import Animated, {
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

import ProgressBar from "../ProgressBar";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";
const AnimatedPath = Animated.createAnimatedComponent(Path);
type HeaderOverlayContentProps = {
  translateY: SharedValue<number>;
};

type NewCourse = {
  id: number;
  title: string;
  description: string;
  image: React.FC<SvgProps>;
  color: string;
  isNew: boolean;
};

const newCourses: NewCourse[] = [
  {
    id: 1,
    title: "Coding",
    description: "New Course Description",
    image: Flag,
    color: "#CE82FF",
    isNew: false,
  },
  {
    id: 2,
    title: "Maths",
    description: "New Course 2 Description",
    image: Flag,
    color: "#1CB0F6",
    isNew: false,
  },
  {
    id: 3,
    title: "Chess",
    description: "New Course 3 Description",
    image: Flag,
    color: "#e6e6bc",
    isNew: true,
  },
];

const HeaderOverlayContent = ({ translateY }: HeaderOverlayContentProps) => {
  const { width } = useWindowDimensions();
  const [scoreBarWidth, setScoreBarWidth] = useState(180);

  const handleScoreBarLayout = (event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;
    if (nextWidth > 0 && Math.abs(nextWidth - scoreBarWidth) > 1) {
      setScoreBarWidth(nextWidth);
    }
  };
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });
  return (
    <Animated.View className="bg-white w-full  pb-3" style={[animatedStyle]}>
      <Svg
        width={width}
        height={16}
        viewBox={`0 0 ${width} 16`}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1,
        }}
      >
        <AnimatedPath
          d={`M0 8 H40 L51 8 L60 1 L69 8 H${width}`}
          fill="none"
          stroke="#E5E5E5"
          strokeWidth={1.8}
          strokeLinejoin="round"
        />
      </Svg>
      <View className="px-4 pt-6">
        <View className="flex-row items-start  gap-3">
          <View className="items-center gap-1 ">
            <View className="h-[70px] w-[85px] items-center justify-center rounded-[14px] border-[3px] border-[#1CB0F6]">
              <Flag width={70} height={70} />
            </View>
            <Text
              className="text-base font-bold text-text-primary"
              style={{ fontFamily: "DINNextRoundedBold" }}
            >
              German
            </Text>
          </View>
          <View className="items-center gap-1  ">
            <View className="h-[70px] w-[85px] scale-[0.75] items-center justify-center rounded-[14px] border-[3px] border-[#AFAFAF] ">
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={20}
                color="#AFAFAF"
              />
            </View>
            <Text className="text-base font-bold text-gray-3 font-rd-bold">
              Course
            </Text>
          </View>
        </View>
        <View className="mt-3 w-full items-center gap-3 rounded-[10px] border border-[#E5E5E5] py-4">
          <View className="w-full flex-row items-center px-5">
            <Text className="text-lg font-bold text-text-primary font-rd-bold">
              13
            </Text>
            <View className="mx-3 flex-1" onLayout={handleScoreBarLayout}>
              <ProgressBar progress={0.72} width={scoreBarWidth} />
            </View>
            <Text
              className="text-lg font-bold text-text-primary font-rd-bold"
              style={{ fontFamily: "DINNextRoundedBold" }}
            >
              14
            </Text>
          </View>
          <Text className="text-xl  text-text-secondary font-rd-regular">
            Your German Score 13
          </Text>
          <Text
            className="text-base uppercase text-[#1CB0F6]"
            style={{
              fontFamily: "DINNextRoundedBold",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            More About score
          </Text>
        </View>
        <View className="mt-3 gap-3 ">
          <Text
            className="text-[24px] font-bold text-text-primary"
            style={{ fontFamily: "DINNextRoundedBold" }}
          >
            New Course
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {newCourses.map((course) => (
              <View key={course.id} className="items-center gap-3">
                <View
                  className="relative h-[55px] w-[75px] items-center justify-center rounded-[10px]"
                  style={[{ backgroundColor: course.color }]}
                >
                  {course.isNew ? (
                    <View className="absolute -right-5 -top-4 z-2 rounded-[8] border-white border-[3] bg-[#FF4B4B] px-[6] py-[6]">
                      <Text className="text-xs font-bold leading-3 text-white">
                        NEW
                      </Text>
                    </View>
                  ) : null}
                  <course.image color={"white"} width={40} height={40} />
                </View>
                <Text
                  className="text-base font-bold text-text-primary"
                  style={{ fontFamily: "DINNextRoundedBold" }}
                >
                  {course.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default HeaderOverlayContent;
