import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Text } from "@/components/ui/text";

type GlassCardProps = {
  label: string;
  description?: string;
  overlayAlpha1?: number;
  overlayAlpha2?: number;
};

export const GlassCard: React.FC<GlassCardProps> = ({
  label,
  description,
  overlayAlpha1 = 0.35,
  overlayAlpha2 = 0.15,
}) => {
  return (
    <View style={styles.container}>
      <BlurView
        intensity={80}
        tint="light"
        style={styles.blurView}
      >
        <LinearGradient
          colors={[
            `rgba(255,255,255,${overlayAlpha1})`,
            `rgba(255,255,255,${overlayAlpha2})`,
          ]}
          style={StyleSheet.absoluteFill}
        />
        <View>
          <Text style={styles.label}>{label}</Text>
          {description && (
            <Text style={styles.description}>
              {description}
            </Text>
          )}
        </View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 100,
  },
  blurView: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  label: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    color: "#555",
    marginTop: 8,
  },
});
