import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import { loadingLottie } from "@/assets/lottie";

const Loading = () => {
  return (
    <LottieView
      autoPlay
      loop
      style={{
        width: 60,
        height: 60,
        zIndex: 99999,
      }}
      source={loadingLottie}
    />
  );
};

export default Loading;

const styles = StyleSheet.create({});
