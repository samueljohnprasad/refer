import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Pressable,
} from "react-native";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import ReanimatedView, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import BreathingBackground from "@/components/ui/BreathingBackground";
import VoiceRecorderModal from "@/components/modals/VoiceRecorderModal";
import MindfulBackground from "@/components/ui/MindfulBackground";
import { Box } from "@/components/ui/box";
import HeaderBar from "@/screens/voiceRecorder/HeaderBar";
import PromptCard from "@/screens/voiceRecorder/PromptCard";
import JournalHeaderSection from "@/screens/voiceRecorder/JournalHeaderSection";
import PlaybackControls from "@/screens/voiceRecorder/PlaybackControls";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import VoiceRecorderModalWrapper from "@/screens/voiceRecorder/VoiceRecorderModalWrapper";
import { atom, useAtom } from "jotai";
export const recorderOpenAtom = atom(false);

export default function VoiceRecorderScreen(): JSX.Element {
  const [recorderOpen, setRecorderOpen] = useAtom(recorderOpenAtom);

  const activeTheme = useSeasonalTheme();

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <MindfulBackground>
        <JournalHeaderSection />
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.promptsButton}>
            <Ionicons name="list" size={20} color="#6B73FF" />
            <Text style={styles.controlButtonText}>Prompts</Text>
          </TouchableOpacity>

          <Pressable
            onPress={() => {
              setRecorderOpen(true);
            }}
            style={[
              styles.simpleButton,
              {
                backgroundColor: activeTheme.particleSparkle,
                shadowColor: activeTheme.particleDot,
              },
            ]}
          >
            <Ionicons name="mic" size={28} color="white" />
          </Pressable>

          <TouchableOpacity
            onPress={() => {
              setRecorderOpen(true);
            }}
            style={styles.typeButton}
          >
            <Ionicons name="create" size={20} color="#6B73FF" />
            <Text style={styles.controlButtonText}>Type</Text>
          </TouchableOpacity>
        </View>

        <VoiceRecorderModalWrapper
          recorderOpen={recorderOpen}
          setRecorderOpen={() => setRecorderOpen(false)}
        />
      </MindfulBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 120,
  },
  promptsButton: {
    alignItems: "center",
    padding: 12,
  },
  typeButton: {
    alignItems: "center",
    padding: 12,
  },
  controlButtonText: {
    fontSize: 14,
    color: "#6B73FF",
    marginTop: 4,
    fontWeight: "500",
  },
  simpleButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
});
