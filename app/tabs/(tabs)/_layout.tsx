import React from "react";
import { NativeTabs } from "expo-router/unstable-native-tabs";

const Label = NativeTabs.Trigger.Label;
const Icon = NativeTabs.Trigger.Icon;
import { useWidgetWeekMoods } from "@/hooks/data/useWidgetWeekMoods";
import { BRAND_BORDER, INK_MUTED, SAGE } from "@/lib/tokens";

const TAB_BAR_BACKGROUND = "rgba(255, 255, 255, 0.92)";

import { View, Text, Pressable } from "react-native";

function SimpleBottomAccessory() {
  const placement = NativeTabs.BottomAccessory.usePlacement();

  if (placement === 'inline') {
    // Compact UI for inline placement (like iPad or standard compact)
    return (
      <Pressable style={{ padding: 8, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18 }}>✨</Text>
      </Pressable>
    );
  }

  // Full UI for regular placement (standard bottom tab bar accessory)
  return (
    <View 
      style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingHorizontal: 16, 
        paddingVertical: 10, 
        // backgroundColor: SAGE[50], 
        // borderTopWidth: 1, 
        // borderColor: SAGE[200] 
      }}
    >
      <Text style={{ color: SAGE[800], fontWeight: '500', fontSize: 14 }}>Daily Reflection</Text>
      <Pressable 
        style={{ 
          backgroundColor: SAGE[500], 
          paddingHorizontal: 12, 
          paddingVertical: 6, 
          borderRadius: 16 
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 13 }}>Start</Text>
      </Pressable>
    </View>
  );
}

export default function TabLayout() {
  useWidgetWeekMoods();

  return (
    <NativeTabs
      tintColor={SAGE[500]}
      backgroundColor={TAB_BAR_BACKGROUND}
      shadowColor={BRAND_BORDER}
      blurEffect="systemUltraThinMaterialLight"
      disableTransparentOnScrollEdge
      minimizeBehavior="onScrollDown"
      indicatorColor="rgba(229, 229, 229, 0.52)"
      rippleColor="rgba(93, 126, 87, 0.12)"
      labelStyle={{
        color: INK_MUTED,
      }}
    // labelStyle={{
    //   // For the text color
    //   color: DynamicColorIOS({
    //     dark: "white",
    //     light: "red",
    //   }),
    // }}
    // // For the selected icon color
    // tintColor={DynamicColorIOS({
    //   dark: "white",
    //   light: "red",
    // })}
    >
      {/* <NativeTabs.BottomAccessory>
        <SimpleBottomAccessory />
      </NativeTabs.BottomAccessory> */}
      
      <NativeTabs.Trigger name="exercises">
        <Label>Exercises</Label>
        <Icon
          sf={{
            default: "doc.text", // inactive
            selected: "doc.text.fill", // active
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="home">
        <Label>Home</Label>
        <Icon
          sf={{
            default: "house", // inactive
            selected: "house.fill", // active
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journal">
        <Label>Journal</Label>
        <Icon
          sf={{
            default: "book.closed", // inactive
            selected: "book.closed.fill", // active
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="record">
        <Label>Record</Label>
        <Icon
          sf={{
            default: "mic", // inactive
            selected: "mic.fill", // active
          }}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="journeys" role="search">
        <Icon
          sf={{
            default: "map", // inactive
            selected: "map.fill", // active
          }}
        />
        <Label>Journeys</Label>


        {/* <Icon
          src={require("@/assets/icons/map.png")}
          renderingMode="original"
        /> */}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
