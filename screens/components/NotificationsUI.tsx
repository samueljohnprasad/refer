// NotificationsUI.tsx
// React Native single-file UI mock (TypeScript) recreating the provided screenshot.
// Note: UI-only, no interactivity.

import React from "react";
import type { ComponentProps } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { notification } from "@/assets/lottie";

type FeatherName = ComponentProps<typeof Feather>["name"];
type MCName = ComponentProps<typeof MaterialCommunityIcons>["name"];

type BaseItem = {
  id: string;
  title: string;
  time: string;
};

type FeItem = BaseItem & { iconLib: "fe"; icon: FeatherName };
type McItem = BaseItem & { iconLib: "mc"; icon: MCName };

type Item = FeItem | McItem;

const DATA: Item[] = [
  {
    id: "1",
    title: "Morning",
    icon: "weather-sunset-up",
    time: "09:01 AM",
    iconLib: "mc",
  },
  { id: "2", title: "Day", icon: "sun", time: "02:30 PM", iconLib: "fe" },
  {
    id: "3",
    title: "Evening",
    icon: "weather-night",
    time: "09:00 PM",
    iconLib: "mc",
  },
];

const NotificationsUI: React.FC = () => {
  const renderItem: ListRenderItem<Item> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.leftRow}>
        <View style={styles.iconWrap}>
          {item.iconLib === "fe" ? (
            <Feather name={item.icon} size={20} style={styles.icon} />
          ) : (
            <MaterialCommunityIcons
              name={item.icon}
              size={20}
              style={styles.icon}
            />
          )}
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      <View style={styles.rightRow}>
        <View style={styles.timePill}>
          <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.toggleCircle} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <LottieView
          autoPlay
          style={{
            width: 200,
            height: 200,
          }}
          source={notification}
        />
        {/* <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Users who set reminders journal
          {`
`}
          2x more consistently
        </Text> */}

        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          scrollEnabled={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backIcon: {
    color: "#262626",
    opacity: 0.9,
  },
  bellContainer: {
    flex: 1,
    alignItems: "center",
  },
  bellCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FCE86F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  bellIcon: {
    color: "#7B5E00",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 10,
    color: "#111827",
  },
  subtitle: {
    textAlign: "center",
    color: "#9AA0A6",
    fontSize: 15,
    marginTop: 8,
    lineHeight: 20,
  },
  listContainer: {
    marginTop: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F6F6F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 0,
  },
  icon: {
    color: "#9AA0A6",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  rightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timePill: {
    backgroundColor: "#F8F8F9",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 0,
  },
  timeText: {
    fontSize: 15,
    color: "#585858",
    fontWeight: "600",
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E6E6E8",
    backgroundColor: "transparent",
  },
});
