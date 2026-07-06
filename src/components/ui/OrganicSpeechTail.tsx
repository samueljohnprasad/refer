import React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

export const OrganicSpeechTail = () => (
  <View className="absolute -left-[14px] top-6" style={{ width: 16, height: 24, zIndex: 10 }}>
    <Svg width="16" height="24" viewBox="0 0 16 24" fill="none">
      <Path
        d="M16 0C16 0 16 10 0 14C16 17 16 24 16 24Z"
        fill="white"
      />
      <Path
        d="M16 0C16 0 16 10 0 14C16 17 16 24 16 24"
        stroke="rgba(0, 0, 0, 0.1)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
    {/* Patch to cover the parent border seamlessly */}
    <View className="absolute right-0 top-[2px] bottom-[2px] w-[3px] bg-white" />
  </View>
);
