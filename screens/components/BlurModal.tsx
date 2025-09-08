import { Modal, View, Button, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useState } from "react";
import Animated, { FadeInLeft } from "react-native-reanimated";
import { router } from "expo-router";

export default function BlurModal() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        title="Open Menu"
        onPress={() => {
          console.log("Open Menu");
          router.push("/tabs/pages/BlurModal");
        }}
      />

      <Modal transparent visible={visible} animationType="fade">
        <BlurView
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
              <Button title="Close" onPress={() => setVisible(false)} />
            </Animated.View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  upgradeButton: {
    borderRadius: 28,
    overflow: "hidden",
    alignSelf: "flex-start",
  },
  upgradeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
