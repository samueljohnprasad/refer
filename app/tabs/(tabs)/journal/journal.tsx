import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Dimensions } from "react-native";
import { getJournalEntries } from "@/app/data/journalData";
import { View as ThemedView } from "@/components/Themed";
import FirefliesParticles from "@/components/ui/FirefliesParticles";
import { Text } from "@/components/ui/text";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { format } from "date-fns";
import { FlatList } from "react-native-gesture-handler";
import { JournalEntry } from "@/app/data/journalData";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.18; // Adjusted for 4-5 cards on iPhone 14
const CARD_MARGIN = 12;

const moodEmoji: Record<string, string> = {
  happy: "😊",
  sad: "😢",
  neutral: "😐",
  excited: "🤩",
  anxious: "😰",
  grateful: "🙏",
  tired: "😴",
};

export default function JournalScreen() {
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const activeTheme = useSeasonalTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const loadJournals = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await getJournalEntries();
      // Sort by date, newest first
      const sortedData = [...data].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setJournals(sortedData);
    } catch (error) {
      console.error("Failed to load journals:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJournals();
  }, [loadJournals]);

  const navigateToDetail = (id: string) => {
    router.push(`/tabs/journal/${id}`);
  };

  const renderJournalItem = ({ item }: { item: JournalEntry }) => (
    <Pressable
      style={({ pressed }) => [
        styles.journalItem,
        pressed && styles.journalItemPressed,
      ]}
      onPress={() => navigateToDetail(item.id)}
      android_ripple={{ color: "rgba(0,0,0,0.1)" }}
    >
      <View style={styles.journalHeader}>
        <Text style={styles.journalDate}>
          {format(new Date(item.created_at), "MMM d, yyyy • h:mm a")}
        </Text>
        <Text style={styles.moodEmoji}>
          {moodEmoji[item.mood_status] || "📝"}
        </Text>
      </View>
      <Text style={styles.journalTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.journalContent} numberOfLines={2}>
        {item.content}
      </Text>
    </Pressable>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Text className="text-4xl font-bold">My Journal</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading your journal entries...</Text>
        </View>
      ) : (
        <FlatList
          data={journals}
          renderItem={renderJournalItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text>No journal entries yet. Start writing!</Text>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingTop: 0, // Ensure content starts below navbar
  },
  header: {
    padding: 16,
    paddingBottom: 20,
    backgroundColor: "#f8f9fa", // Match container background color
    zIndex: 1, // Ensure header is above content
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 100, // Add extra space at the bottom for tab bar
  },
  journalItem: {
    height: CARD_HEIGHT,
    borderRadius: 16,
    padding: 18,
    marginBottom: CARD_MARGIN,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "white",
  },
  journalItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  journalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  journalDate: {
    fontSize: 12,
    color: "#666",
  },
  moodEmoji: {
    fontSize: 16,
  },
  journalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  journalContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
