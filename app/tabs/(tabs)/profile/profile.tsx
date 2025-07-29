import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Pressable,
  Switch,
} from "react-native";
import { View as ThemedView } from "@/components/Themed";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import FirefliesParticles from "@/components/ui/FirefliesParticles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { Stack } from "expo-router";

interface SettingItemProps {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle?: string;
  hasToggle?: boolean;
  toggled?: boolean;
  onToggleChange?: (value: boolean) => void;
  onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  subtitle,
  hasToggle,
  toggled,
  onToggleChange,
  onPress,
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.settingItem, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.settingIconContainer}>
        <Feather name={icon} size={22} color="#4A6572" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {hasToggle && (
        <Switch
          value={toggled}
          onValueChange={onToggleChange}
          trackColor={{ false: "#d1d1d1", true: "#86c5da" }}
          thumbColor={toggled ? "#0096c7" : "#f4f3f4"}
        />
      )}
      {!hasToggle && <Feather name="chevron-right" size={20} color="#a0a0a0" />}
    </Pressable>
  );
};

const ProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const activeTheme = useSeasonalTheme();

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    joined: "July 2025",
    journalCount: 22,
    streakDays: 7,
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Profile",
          headerStyle: {
            backgroundColor: "#f8f9fa",
          },
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.profileImage}
            />
          </View>
          <Heading style={styles.userName}>{userData.name}</Heading>
          <Text style={styles.userEmail}>{userData.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.journalCount}</Text>
              <Text style={styles.statLabel}>Entries</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.streakDays}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.joined}</Text>
              <Text style={styles.statLabel}>Joined</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <SettingItem
            icon="moon"
            title="Dark Mode"
            hasToggle
            toggled={darkMode}
            onToggleChange={setDarkMode}
          />

          <SettingItem
            icon="bell"
            title="Notifications"
            subtitle="Receive updates about your journal"
            hasToggle
            toggled={notifications}
            onToggleChange={setNotifications}
          />

          <SettingItem
            icon="clock"
            title="Daily Reminder"
            subtitle="Set time to journal daily"
            hasToggle
            toggled={reminders}
            onToggleChange={setReminders}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <SettingItem
            icon="user"
            title="Edit Profile"
            onPress={() => console.log("Edit Profile pressed")}
          />

          <SettingItem
            icon="shield"
            title="Privacy Settings"
            onPress={() => console.log("Privacy Settings pressed")}
          />

          <SettingItem
            icon="help-circle"
            title="Help & Support"
            onPress={() => console.log("Help pressed")}
          />

          <SettingItem
            icon="info"
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => console.log("About pressed")}
          />
        </View>

        <Pressable style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    color: "#2c3e50",
  },
  userEmail: {
    fontSize: 14,
    color: "#7f8c8d",
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#e0e0e0",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 12,
    marginLeft: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2c3e50",
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#7f8c8d",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#f8d7da",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoutButtonText: {
    color: "#e74c3c",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
