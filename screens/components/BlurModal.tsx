import {
  Modal,
  View,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, { FadeInLeft } from "react-native-reanimated";
import type { MoodEntry } from "@/types/mentalHealth";

interface BlurModalProps {
  visible: boolean;
  onClose: () => void;
  dateLabel?: string;
  onAddEntry?: () => void;
  entries?: MoodEntry[];
  onSelectEntry?: (entry: MoodEntry) => void;
  children?: React.ReactNode;
}

export default function BlurModal({ visible, children }: BlurModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <BlurView
        intensity={10}
        style={{
          flex: 1,
          justifyContent: "flex-start",
        }}
      >
        {children}
      </BlurView>
    </Modal>
  );
}

{
  /* <View style={[styles.card]}>
  <Text style={styles.title}>Selected Day</Text>
  {dateLabel ? <Text style={styles.subtitle}>{dateLabel}</Text> : null}

  <View style={{ height: 12 }} />

  <TouchableOpacity
    activeOpacity={0.9}
    style={styles.primaryBtn}
    onPress={onAddEntry ?? onClose}
  >
    <Text style={styles.primaryText}>Add Entry</Text>
  </TouchableOpacity>

  {entries.length > 0 ? (
    <View style={{ marginTop: 12 }}>
      <Text style={styles.listHeader}>Entries</Text>
      <ScrollView style={{ maxHeight: 220 }}>
        {entries.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={styles.entryRow}
            onPress={() => onSelectEntry && onSelectEntry(e)}
            activeOpacity={0.9}
            accessibilityLabel={`Open ${e.aiTitle}`}
          >
            <View style={styles.entryEmojiWrap}>
              <Text style={{ fontSize: 18 }}>📝</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{e.aiTitle}</Text>
              <Text style={styles.entryMeta}>
                {new Date(e.timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  ) : null}

  <View style={{ height: 6 }} />
  <Button title="Close" onPress={onClose} />
</View>; */
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(15,23,42,0.08)",
  },
  title: { fontSize: 18, fontWeight: "800", color: "#0F172A" },
  subtitle: { marginTop: 2, color: "#475569", fontWeight: "600" },
  primaryBtn: {
    backgroundColor: "#FFD24A",
    paddingVertical: 12,
    borderRadius: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    marginTop: 12,
  },
  primaryText: { fontWeight: "800", color: "#111827" },
  listHeader: { fontWeight: "800", color: "#0F172A", marginBottom: 6 },
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  entryEmojiWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    marginRight: 10,
  },
  entryTitle: { fontWeight: "700", color: "#0F172A" },
  entryMeta: { color: "#64748B", fontWeight: "600", marginTop: 2 },
  chevron: { fontSize: 22, color: "#0F172A", marginLeft: 8 },
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
