import React, { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export type MicrolearningMediaSource =
  | {
      kind: "image";
      uri: string;
      accessibilityDescription: string;
      caption?: string;
    }
  | {
      kind: "audio";
      uri: string;
      transcript: string;
      label?: string;
    };

export function MicrolearningMedia({
  media,
}: {
  media?: MicrolearningMediaSource | null;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const audioSource = media?.kind === "audio" ? { uri: media.uri } : null;
  const player = useAudioPlayer(audioSource);
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setImageFailed(false);
  }, [media?.kind, media?.uri]);

  if (!media) return null;
  if (media.kind === "image") {
    return (
      <View style={styles.media}>
        {!imageFailed ? (
          <Image
            accessibilityLabel={media.accessibilityDescription}
            onError={() => setImageFailed(true)}
            resizeMode="contain"
            source={{ uri: media.uri }}
            style={styles.image}
          />
        ) : (
          <Text style={styles.equivalent}>{media.accessibilityDescription}</Text>
        )}
        {media.caption ? <Text style={styles.caption}>{media.caption}</Text> : null}
      </View>
    );
  }

  const replay = async () => {
    await player.seekTo(0);
    player.play();
  };
  return (
    <View style={styles.media}>
      {!status.error ? (
        <View style={styles.controls}>
          <AudioButton
            label={status.playing ? "Pause audio" : "Play audio"}
            onPress={() => (status.playing ? player.pause() : player.play())}
          />
          <AudioButton label="Replay audio" onPress={() => void replay()} />
        </View>
      ) : null}
      <Text style={styles.caption}>{media.label ?? "Transcript"}</Text>
      <Text style={styles.equivalent}>{media.transcript}</Text>
    </View>
  );
}

function AudioButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.audioButton, pressed && styles.pressed]}
    >
      <Text style={styles.audioLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  media: { gap: 10 },
  image: { width: "100%", minHeight: 180, borderRadius: 14 },
  controls: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  audioButton: {
    minHeight: 48,
    justifyContent: "center",
    borderRadius: 999,
    paddingHorizontal: 16,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  audioLabel: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
  equivalent: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
  },
  pressed: { opacity: 0.65 },
});
