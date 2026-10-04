import React from "react";
import { Text, View } from "react-native";
import { Image } from "expo-image";
import { Card } from "@/src/components/ui/Card";
import type { EnrolledCourseListItem } from "@/src/types/journeyV5";
import {
  getCourseImageSource,
  getCourseMonogram,
  resolveCourseAccentColor,
} from "@/src/domains/journey/model/courseVisuals";
import { FONTS, PALETTE } from "../hooks/useHeaderOverlayContentViewModel";

export function CourseAvatar({
  course,
  isActive,
}: {
  course: EnrolledCourseListItem;
  isActive: boolean;
}): React.JSX.Element {
  const accentColor = resolveCourseAccentColor(course.colorHex);
  const imageSource = getCourseImageSource(course.iconUrl);

  return (
    <Card
      variant="tile"
      radius="xl"
      showDepth={false}
      className="h-[78px] w-[92px]"
      contentClassName="items-center justify-center h-full w-full"
      faceStyle={{
        borderWidth: isActive ? 2 : 1,
        borderColor: isActive ? PALETTE.sage500 : PALETTE.sage100,
        backgroundColor: isActive ? `${accentColor}12` : PALETTE.warmWhite,
      }}
    >
      <View
        className="h-[52px] w-[52px] items-center justify-center rounded-[16px]"
        style={imageSource ? undefined : { backgroundColor: `${accentColor}1A` }}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: 46, height: 46, borderRadius: 14 }}
            cachePolicy="memory-disk"
            contentFit="contain"
            transition={150}
          />
        ) : (
          <Text
            style={{
              color: accentColor,
              fontFamily: FONTS.heading,
              fontSize: 26,
            }}
          >
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>
    </Card>
  );
}
