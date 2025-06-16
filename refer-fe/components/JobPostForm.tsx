import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

export default function JobPostForm({
  onSubmit,
}: {
  onSubmit?: (data: any) => void;
}) {
  const [resume, setResume] = useState("");
  const [interest, setInterest] = useState("");
  const [privacy, setPrivacy] = useState<"Public" | "Private" | "Anonymous">(
    "Public"
  );
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!resume || !interest) {
      setError("Resume and interest statement are required.");
      return;
    }
    setError("");
    onSubmit?.({ resume, interest, privacy });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Create Job Seeker Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Resume URL or Upload"
        value={resume}
        onChangeText={setResume}
        accessibilityLabel="Resume Input"
        placeholderTextColor="#B0B8C1"
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Interest Statement"
        value={interest}
        onChangeText={setInterest}
        multiline
        accessibilityLabel="Interest Statement Input"
        placeholderTextColor="#B0B8C1"
      />
      <View style={styles.privacyRow}>
        {["Public", "Private", "Anonymous"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.privacyButton,
              privacy === option && styles.privacyButtonActive,
            ]}
            onPress={() => setPrivacy(option as any)}
            accessibilityLabel={`Set privacy to ${option}`}
            activeOpacity={0.85}
          >
            <Text
              style={
                privacy === option
                  ? styles.privacyTextActive
                  : styles.privacyText
              }
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        accessibilityLabel="Submit Job Post"
        activeOpacity={0.85}
      >
        <Text style={styles.submitText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 28,
    backgroundColor: "#F7FAFC",
    borderRadius: 18,
    marginVertical: 24,
    shadowColor: "#3D5AFE",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E4E9F2",
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222B45",
    marginBottom: 20,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#E4E9F2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#222B45",
    shadowColor: "#3D5AFE",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,

  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  privacyRow: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
    justifyContent: "center",
  },
  privacyButton: {
    borderWidth: 1.5,
    borderColor: "#B0B8C1",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#F0F4FF",
    marginHorizontal: 2,
    marginBottom: 2,
    shadowColor: "#3D5AFE",
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    minWidth: 80,
    alignItems: "center",
  },
  privacyButtonActive: {
    backgroundColor: "#3D5AFE",
    borderColor: "#3D5AFE",
    shadowOpacity: 0.08,
  },
  privacyText: {
    color: "#3D5AFE",
    fontWeight: "bold",
    fontSize: 15,
  },
  privacyTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  error: {
    color: "#FF5252",
    marginBottom: 12,
    textAlign: "center",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#3D5AFE",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#3D5AFE",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 4,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 17,
    letterSpacing: 0.2,
  },
});
