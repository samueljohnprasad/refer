import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { BlurView } from "expo-blur";
import { useShowcaseTheme } from "@gorhom/showcase-template";

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginHorizontal: 12,
  },
});

export function BlurredBackground() {
  const { colors } = useShowcaseTheme();
  const containerStyle = useMemo(
    () => [
      styles.container,
      {
        backgroundColor: colors.background,
        opacity: 1,
      },
    ],
    [colors.background]
  );
  return Platform.OS === "ios" ? (
    <View style={styles.container}>
      <BlurView intensity={50} style={styles.blurView} />
    </View>
  ) : (
    <View style={containerStyle} />
  );
}
