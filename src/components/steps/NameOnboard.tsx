import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  FadeIn,
  FadeInDown,
  interpolate,
  Easing,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { lendHand } from "@/assets/lottie";
import NameInput from "../animations/name-input/NameInput";

type NameOnboardProps = {
  name: string;
  setName: (name: string) => void;
};

export const NameOnboard: React.FC<NameOnboardProps> = ({ name, setName }) => {
  const welcomeOpacity = useSharedValue(0);

  useEffect(() => {
    if (name.length > 0) {
      welcomeOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.ease,
      });
    } else {
      welcomeOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [name]);

  const welcomeAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: welcomeOpacity.value,
      transform: [
        {
          translateY: interpolate(welcomeOpacity.value, [0, 1], [20, 0]),
        },
        {
          scale: interpolate(welcomeOpacity.value, [0, 1], [0.9, 1]),
        },
      ],
    };
  });

  return (
    <View className="w-full">
      <View style={styles.container}>
        {/* Premium Lottie Animation with Glass Container */}
        <Animated.View
          entering={FadeIn.duration(600).delay(200)}
          style={[styles.lottieContainer]}
        >
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: 80,
              padding: 16,
              borderWidth: 1,
              borderColor: "rgba(255, 255, 255, 0.3)",
            }}
          >
            {/* <LottieView
              autoPlay
              loop
              style={{
                width: 100,
                height: 100,
              }}
              source={lendHand}
            /> */}
          </View>
        </Animated.View>

        {/* Premium Title with Gradient Effect */}
        <Animated.View entering={FadeInDown.duration(500).delay(300)}>
          <Text style={styles.title}>What's your name?</Text>
          <Text style={styles.titleEmoji}>✍️</Text>
        </Animated.View>

        {/* Premium Input Field with Glass Effect */}
        <Animated.View
          entering={FadeInDown.duration(500).delay(400)}
          style={styles.inputContainer}
        >
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: 20,
              padding: 4,
              borderWidth: 1.5,
              borderColor: "rgba(124, 58, 237, 0.1)",
              shadowColor: "#7C3AED",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <NameInput
              label="Your first name"
              placeholder="Enter your name..."
              value={name}
              onChangeText={setName}
              backgroundColor="transparent"
            />
          </View>
        </Animated.View>

        {/* Dynamic Helper Text with Premium Animation */}
        {name.length > 0 ? (
          <Text style={styles.helper}>
            Nice to meet you, {name.split(" ")[0]}!
          </Text>
        ) : (
          <Text style={styles.helper}>You can always change this later.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  lottieContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 6,
    letterSpacing: -0.8,
    textAlign: "center",
    lineHeight: 34,
  },
  titleEmoji: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  inputContainer: {
    width: "100%",
    marginTop: 12,
  },

  helper: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  welcomeContainer: {
    marginTop: 16,
    marginBottom: 0,
    width: "100%",
  },
  welcomeGradient: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F3E8FF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E9D5FF",
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  welcomeEmoji: {
    fontSize: 30,
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#7C3AED",
    marginBottom: 4,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  welcomeSubtext: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
    marginBottom: 12,
  },
  progressIndicator: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "80%",
    height: 5,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    width: "20%",
    height: "100%",
    backgroundColor: "#7C3AED",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#9333EA",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
