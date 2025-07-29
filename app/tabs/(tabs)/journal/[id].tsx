import { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { View as ThemedView } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import { getJournalEntries, JournalEntry } from "@/app/data/journalData";
import { format } from "date-fns";
import FirefliesParticles from "@/components/ui/FirefliesParticles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Mood emoji mapping with colors
const moodEmoji: Record<string, { emoji: string; color: string }> = {
  happy: { emoji: "😊", color: "#FFD700" },
  sad: { emoji: "😢", color: "#4682B4" },
  neutral: { emoji: "😐", color: "#A9A9A9" },
  excited: { emoji: "🤩", color: "#FF69B4" },
  anxious: { emoji: "😰", color: "#9370DB" },
  grateful: { emoji: "🙏", color: "#32CD32" },
  tired: { emoji: "😴", color: "#1E90FF" },
};

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams();
  const [journal, setJournal] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Fetch the journal entry by ID
    const fetchJournal = async () => {
      setLoading(true);
      try {
        const { data } = await getJournalEntries();
        const foundJournal = data.find((entry) => entry.id === id);

        if (foundJournal) {
          setJournal(foundJournal);
        }
      } catch (error) {
        console.error("Error fetching journal:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchJournal();
    }
  }, [id]);

  const mood = journal?.mood_status
    ? moodEmoji[journal.mood_status]
    : { emoji: "📝", color: "#9E9E9E" };

  if (loading) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </ThemedView>
    );
  }

  if (!journal) {
    return (
      <ThemedView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Journal entry not found</Text>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Journal Entry",
          headerShown: true,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.date}>
            {format(new Date(journal.created_at), "MMMM d, yyyy • h:mm a")}
          </Text>

          <View
            style={[
              styles.moodContainer,
              { backgroundColor: `${mood.color}30` },
            ]}
          >
            <Text style={styles.moodEmoji}>{mood.emoji}</Text>
          </View>
        </View>

        <Text className="text-2xl font-bold mb-4">{journal.title}</Text>

        <View style={styles.contentBox}>
          <Text style={styles.content}>{journal.content}</Text>
        </View>

        <View style={styles.metadataContainer}>
          {journal.updated_at !== journal.created_at && (
            <Text style={styles.updatedText}>
              Last edited:{" "}
              {format(new Date(journal.updated_at), "MMMM d, yyyy • h:mm a")}
            </Text>
          )}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
  moodContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  moodEmoji: {
    fontSize: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#2c3e50",
  },
  contentBox: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  metadataContainer: {
    marginTop: 20,
  },
  updatedText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic",
  },
  errorText: {
    fontSize: 18,
    color: "#e74c3c",
  },
});
