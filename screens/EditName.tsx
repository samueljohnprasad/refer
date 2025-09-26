// NameEditScreen.js
// React Native component
// High-fidelity mock of an "Edit name" screen inspired by the provided quiz screens.

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardToolbar } from "react-native-keyboard-controller";
import { useGradualAnimation } from "@/hooks/useGradualAnimation";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useUpdateDisplayName, useUserProfile } from "@/hooks/useUserProfile";

interface NameEditScreenProps {
  setShowModal: (show: boolean) => void;
}

export default function NameEditScreen({ setShowModal }: NameEditScreenProps) {
  const { height } = useGradualAnimation();

  const [name, setName] = useState("");
  const { mutate: updateDisplayName, isPending: isUpdating } =
    useUpdateDisplayName();
  const { data: userProfile, isLoading: isLoadingProfile } = useUserProfile();

  useEffect(() => {
    if (userProfile?.displayName) {
      setName(userProfile.displayName);
    }
  }, [userProfile?.displayName]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    updateDisplayName(name.trim(), {
      onSuccess: () => {
        setShowModal(false);
      },
      onError: (error: Error) => {
        console.error("Error updating display name:", error);
        Alert.alert("Error", "Failed to update name. Please try again.");
      },
    });
  };

  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowModal(false)}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { opacity: 0.8 }]} />
            <View style={[styles.dot, { opacity: 0.5 }]} />
            <View style={[styles.dot, { opacity: 0.3 }]} />
            <View style={[styles.dot, { opacity: 0.2 }]} />
          </View>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="grid-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Main content */}
        <View style={styles.content}>
          <Text style={styles.title}>Edit your name</Text>

          {/* Avatar */}
          <LinearGradient
            colors={["#FFC4A1", "#FF9C7A"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 0.8, y: 0.8 }}
            style={styles.avatar}
          >
            <Ionicons name="person" size={54} color="rgba(255,255,255,0.9)" />
          </LinearGradient>

          {/* Input */}
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              maxLength={18}
              placeholder="Your name"
              placeholderTextColor="rgba(255,154,122,0.5)"
              textAlign="center"
            />
          </View>
        </View>

        {/* Bottom buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowModal(false)}
            disabled={isUpdating}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.saveButton, isUpdating && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isUpdating}
          >
            <Text style={styles.saveText}>
              {isUpdating ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={keyboardPadding} />
      </View>
      <KeyboardToolbar
        // content={<Text>This is a toolbar</Text>}
        showArrows={false}
        insets={{ left: 16, right: 0 }}
        doneText="Close keyboard"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7366ea",
    padding: 20,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  progressDots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#FF9C7A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  inputWrapper: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 50,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 20,
  },
  input: {
    fontSize: 32,
    fontWeight: "600",
    color: "#FF9A7A",
  },
  hint: {
    marginTop: 10,
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cancelText: {
    color: "#111827",
    fontWeight: "500",
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#ffd23f",
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#ffd23f",
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  saveText: {
    color: "#7366ea",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
});
