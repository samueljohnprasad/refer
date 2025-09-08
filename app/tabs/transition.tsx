import { View, Button } from "react-native";
import React from "react";
import { useRouter } from "expo-router";

const transition = () => {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#fff",
      }}
    >
      {/* Tap to dismiss */}
      <Button title="Close" onPress={() => router.back()} />
    </View>
  );
};

export default transition;
