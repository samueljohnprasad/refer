import React, { useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, TextInput, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import LottieView from "lottie-react-native";
import { lendHand } from "@/assets/lottie";
import NameInput from "../animations/name-input/NameInput";

export const NameOnboard = () => {
  const { height } = useGradualAnimation();
  const [name, setName] = useState("");
  const inputRef = useRef<TextInput>(null);

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const toggleKeyboard = () => {
    if (Keyboard.isVisible()) {
      Keyboard.dismiss();
    } else {
      inputRef.current?.focus();
    }
  };

  return (
    <GestureHandlerRootView className="w-full">
      <View className="flex-1">
        <View style={styles.container}>
          <LottieView
            autoPlay
            style={{
              width: 200,
              height: 200,
            }}
            source={lendHand}
          />
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
        <Animated.View style={keyboardPadding} />
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
