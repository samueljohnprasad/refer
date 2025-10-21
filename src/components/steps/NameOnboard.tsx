import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { lendHand } from "@/assets/lottie";
import NameInput from "../animations/name-input/NameInput";

type NameOnboardProps = {
  name: string;
  setName: (name: string) => void;
};

export const NameOnboard: React.FC<NameOnboardProps> = ({ name, setName }) => {
  return (
    <GestureHandlerRootView className="w-full">
      <View className="flex-1">
        <View style={styles.container}>
          {/* <LottieView
            autoPlay
            style={{
              width: 200,
              height: 200,
            }}
            source={lendHand}
          /> */}
          <Animated.Text style={styles.title}>What's your name?</Animated.Text>
          <NameInput
            label="Enter your name"
            placeholder=""
            value={name}
            onChangeText={setName}
            backgroundColor="#fff"
          />
          {name.length > 0 ? (
            <Text style={styles.helper}>
              Nice to meet you, {name.split(" ")[0]}!
            </Text>
          ) : (
            <Text style={styles.helper}>You can always change this later.</Text>
          )}
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 10,
  },
  helper: {
    marginTop: 16,
    color: "rgba(15,23,42,0.6)",
  },
});
