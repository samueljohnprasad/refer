import { View, Text, Button, StyleSheet, Pressable } from "react-native";
import React from "react";
import { AnimatedBlurView } from "@/components/ui/AnimatedModal";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";

const BlurModal = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      <AnimatedBlurView
        intensity={40}
        // tint="dark"
        style={{ flex: 1, justifyContent: "flex-start" }}
      >
        <View
          style={{
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
            marginTop: 60,
          }}
        >
          <Animated.View entering={FadeInLeft.duration(200).delay(300)}>
            <Button
              title="Close"
              onPress={() => {
                navigation.goBack();
              }}
            />
          </Animated.View>

          <Pressable
            android_ripple={{ color: "#6D4AFF" }}
            onPress={() => {}}
            style={{
              borderRadius: 28,
              overflow: "hidden",
              alignSelf: "flex-start",
            }}
          >
            <LinearGradient
              colors={["#7C5CFF", "#9C7CFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.upgradeButton}
            >
              <Text style={styles.upgradeText}>Upgrade to Premium</Text>
            </LinearGradient>
          </Pressable>
        </View>
      </AnimatedBlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  upgradeButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 28,
  },
  upgradeText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
});

export default BlurModal;
