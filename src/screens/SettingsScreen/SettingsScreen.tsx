import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Pressable,
  Linking,
  Button,
  useWindowDimensions,
  Animated,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Link, Stack, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useAuth } from "@/src/context/AuthContext";
import NameEditScreen from "../NameEditScreen/NameEditScreen";
import { useStreakReminders } from "@/hooks/notifications/useStreakReminders";
import { useBulkImportJournals } from "@/hooks/post/useBulkImportJournals";
import { format, subDays } from "date-fns";

export default React.memo(function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [passcodeEnabled, setPasscodeEnabled] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState({ hour: 9, minute: 0 });
  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { user, session, loading, signOut } = useAuth();
  const { scheduleStreakReminder, cancelAllStreakReminders, requestNotificationPermissions } = useStreakReminders();

  const [showModal, setShowModal] = useState({
    modalType: "",
    showModal: false,
  });

  // Bulk import state
  const { bulkImport, importing, progress } = useBulkImportJournals();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDaysCount, setImportDaysCount] = useState("20");
  const [importStartDate, setImportStartDate] = useState<Date>(subDays(new Date(), 20));

  // Handle reminder toggle
  const handleReminderToggle = async (enabled: boolean) => {
    Haptics.selectionAsync();
    
    if (enabled) {
      // Request permissions first
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        alert("Please enable notifications in your device settings");
        return;
      }
      
      // Schedule reminder
      await scheduleStreakReminder({
        hour: reminderTime.hour,
        minute: reminderTime.minute,
        enabled: true,
      });
      setRemindersEnabled(true);
    } else {
      // Cancel all reminders
      await cancelAllStreakReminders();
      setRemindersEnabled(false);
    }
  };

  const [upgradeY, setUpgradeY] = useState<number | null>(null);
  const handleToggle = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    value: boolean
  ) => {
    Haptics.selectionAsync();
    setter(value);
  };

  const handlePress = (type: string) => {
    Haptics.selectionAsync();
    setShowModal({ modalType: type, showModal: true });
  };

  const handleRateUs = () => {
    Haptics.selectionAsync();
    Linking.openURL("https://apps.apple.com/app/idYOUR_APP_ID");
  };

  const handleBulkImport = async () => {
    const count = parseInt(importDaysCount);
    if (isNaN(count) || count <= 0 || count > 20) {
      Alert.alert("Invalid Count", "Please enter a number between 1 and 20");
      return;
    }

    try {
      await bulkImport(importStartDate, count);
      Alert.alert("Success", `Successfully imported ${count} journal entries!`);
      setShowImportModal(false);
    } catch (error) {
      Alert.alert("Error", `Failed to import journals: ${error}`);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "regular",
          header(props) {
            return (
              <BlurView
                intensity={50}
                tint="light"
                style={[
                  styles.headerRow,
                  {
                    height: height * 0.14,
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    paddingHorizontal: 16,
                    backgroundColor: "transparent",
                    paddingBottom: 16,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.backBtn}
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                >
                  <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Settings</Text>
                {upgradeY !== null && (
                  <Animated.View
                    style={{
                      position: "absolute",
                      right: 16,
                      bottom: 16,
                      opacity: scrollY.interpolate({
                        inputRange: [upgradeY + 20, upgradeY + 20 + 40],
                        outputRange: [0, 1],
                        extrapolate: "clamp",
                      }),
                    }}
                  >
                    <Pressable
                      android_ripple={{ color: "#6D4AFF" }}
                      onPress={() => router.push("/tabs/screens/paywall")}
                      style={{ borderRadius: 24, overflow: "hidden" }}
                    >
                      <LinearGradient
                        colors={["#7C5CFF", "#9C7CFF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[
                          styles.upgradeButton,
                          { paddingVertical: 8, paddingHorizontal: 14 },
                        ]}
                      >
                        <Text style={styles.upgradeText}>Upgrade</Text>
                      </LinearGradient>
                    </Pressable>
                  </Animated.View>
                )}

                <View style={{ width: 36 }} />
              </BlurView>
            );
          },
        }}
      />
      <View style={styles.surface}>
        {/* Header */}
        {/* <BlurView intensity={50} tint="dark" style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={handlePress}
          >
            <Ionicons name="arrow-back" size={20} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 36 }} />
        </BlurView> */}

        <Animated.ScrollView
          contentContainerStyle={[
            styles.scrollViewContent,
            { paddingTop: headerHeight, paddingBottom: 24 },
          ]}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          nestedScrollEnabled={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Promo Card */}
          <View style={styles.promoCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.promoTitle}>Unlock All Features</Text>
              <Text style={styles.promoSubtitle} numberOfLines={3}>
                AI Insights, Weekly Summaries,{"\n"}Advanced Dashboard,{"\n"}
                Longer Recordings, and more.
              </Text>
              {/* <MyMenu /> */}
              {/* <MyContextMenu /> */}
              {/* <BlurModal /> */}
              {/* <Link href="/tabs/pages/BlurModal" asChild>
                <Button title="Open Menuu" />
              </Link> */}
              {/* <Button
                title="Open Menuu"
                onPress={() => {
                  router.push("/tabs/pages/BlurModal");
                }}
              /> */}

              <Pressable
                android_ripple={{ color: "#6D4AFF" }}
                onPress={() => {
                  router.push("/tabs/screens/paywall");
                }}
                style={{
                  borderRadius: 28,
                  overflow: "hidden",
                  alignSelf: "flex-start",
                }}
                onLayout={(e) => setUpgradeY(e.nativeEvent.layout.y)}
              >
                <LinearGradient
                  colors={["#7C5CFF", "#9C7CFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.upgradeButton}
                >
                  <Text style={styles.upgradeText}>Upgrade to Premium</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Settings Group */}
          <View style={styles.cardGroup}>
            <View style={styles.rowItem}>
              <View style={[styles.leftIcon, { backgroundColor: "#FDE68A" }]}>
                <Feather name="bell" size={20} color="#F59E0B" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Notifications</Text>
                <Text style={styles.itemSubtitle}>Push alerts, reminders</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={(val) => handleToggle(setNotifications, val)}
                trackColor={{ true: "#7C5CFF", false: "#E6E6E6" }}
                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
                ios_backgroundColor="#E6E6E6"
              />
            </View>

            <View style={styles.rowItem}>
              <View style={[styles.leftIcon, { backgroundColor: "#BBF7D0" }]}>
                <Feather name="calendar" size={20} color="#22C55E" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Daily Streak Reminder</Text>
                <Text style={styles.itemSubtitle}>
                  Get reminded at {reminderTime.hour}:{reminderTime.minute.toString().padStart(2, '0')}
                </Text>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={handleReminderToggle}
                trackColor={{ true: "#7C5CFF", false: "#E6E6E6" }}
                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
                ios_backgroundColor="#E6E6E6"
              />
            </View>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/reminders" as any);
              }}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#E9D5FF" }]}>
                <MaterialCommunityIcons name="bell-ring" size={20} color="#A855F7" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Daily Reminders</Text>
                <Text style={styles.itemSubtitle}>
                  Customize multiple reminders
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => router.push("/achievements" as any)}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#FEF3C7" }]}>
                <Feather name="award" size={20} color="#F59E0B" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Achievements</Text>
                <Text style={styles.itemSubtitle}>View your badges</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => {
                handlePress("edit-name");
              }}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#FECACA" }]}>
                <Feather name="user" size={20} color="#EF4444" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Edit Name</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => {
                // handlePress("language");
                signOut();
              }}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#BFDBFE" }]}>
                <Feather name="globe" size={20} color="#3B82F6" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Language</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.rowItem}>
              <View style={[styles.leftIcon, { backgroundColor: "#DDD6FE" }]}>
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color="#7C3AED"
                />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Set Up Passcode</Text>
                <Text style={styles.itemSubtitle}>Face/Touch ID</Text>
              </View>
              <Switch
                value={passcodeEnabled}
                onValueChange={(val) => handleToggle(setPasscodeEnabled, val)}
                trackColor={{ true: "#7C5CFF", false: "#E6E6E6" }}
                thumbColor={Platform.OS === "android" ? "#fff" : undefined}
                ios_backgroundColor="#E6E6E6"
              />
            </View>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => {
                handlePress("contact-support");
              }}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#CFFAFE" }]}>
                <Feather name="message-square" size={20} color="#06B6D4" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={handleRateUs}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#DCFCE7" }]}>
                <Feather name="star" size={20} color="#16A34A" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Rate Us</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Settings Group 2 */}
          <View style={[styles.cardGroup, { marginTop: 14 }]}>
            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => {
                handlePress("copy-id");
              }}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#E0F2FE" }]}>
                <Feather name="copy" size={20} color="#0284C7" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Copy My ID</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => {
                handlePress("terms-of-use");
              }}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#F3E8FF" }]}>
                <Feather name="file-text" size={20} color="#9333EA" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Terms of Use</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.rowItem}>
              <View style={[styles.leftIcon, { backgroundColor: "#FEF3C7" }]}>
                <Feather name="info" size={20} color="#D97706" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>App Info</Text>
                <Text style={styles.itemSubtitle}>Version 1.0.0 (Build 1)</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.rowItem}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                setShowImportModal(true);
              }}
            >
              <View style={[styles.leftIcon, { backgroundColor: "#E9D5FF" }]}>
                <Feather name="download" size={20} color="#9333EA" />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.itemTitle}>Bulk Import Journals</Text>
                <Text style={styles.itemSubtitle}>Import sample data</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </Animated.ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal.showModal}
      >
        <NameEditScreen
          setShowModal={() => setShowModal({ showModal: false, modalType: "" })}
        />
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImportModal}
        onRequestClose={() => !importing && setShowImportModal(false)}
      >
        <BlurView intensity={80} tint="dark" style={styles.modalOverlay}>
          <View style={styles.importModalContent}>
            <Text style={styles.modalTitle}>Bulk Import Journals</Text>
            <Text style={styles.modalSubtitle}>
              Import sample journal entries for testing
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <View style={styles.dateDisplay}>
                <Feather name="calendar" size={18} color="#7C5CFF" />
                <Text style={styles.dateText}>
                  {format(importStartDate, "MMM dd, yyyy")}
                </Text>
              </View>
              <Text style={styles.inputHint}>
                Entries will be created from this date forward
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Number of Days (1-20)</Text>
              <TextInput
                style={styles.input}
                value={importDaysCount}
                onChangeText={setImportDaysCount}
                keyboardType="number-pad"
                placeholder="20"
                maxLength={2}
                editable={!importing}
              />
              <Text style={styles.inputHint}>
                {importDaysCount} {parseInt(importDaysCount) === 1 ? 'entry' : 'entries'} will be imported
              </Text>
            </View>

            {importing && (
              <View style={styles.progressContainer}>
                <ActivityIndicator size="large" color="#7C5CFF" />
                <Text style={styles.progressText}>
                  Importing {progress.current} of {progress.total}...
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowImportModal(false)}
                disabled={importing}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.importButton, importing && styles.importButtonDisabled]}
                onPress={handleBulkImport}
                disabled={importing}
              >
                <LinearGradient
                  colors={importing ? ["#999", "#777"] : ["#7C5CFF", "#9C7CFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.importButtonGradient}
                >
                  <Text style={styles.importButtonText}>
                    {importing ? "Importing..." : "Import"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </SafeAreaView>
  );
});
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F8F8FF" },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  surface: {
    flex: 1,
    // backgroundColor: "#F7F6FF",
    paddingHorizontal: 0,
    // backgroundColor: "red",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7C5CFF",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  promoCard: {
    backgroundColor: "#FFED6B",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  promoTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0B1220",
    marginBottom: 6,
  },
  promoSubtitle: {
    color: "#374151",
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 12,
  },
  upgradeButton: {
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 28,
  },
  upgradeText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
  },
  illustrationWrap: {
    width: 110,
    height: 110,
    justifyContent: "center",
    alignItems: "center",
  },

  cardGroup: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomColor: "#F0F0F3",
    borderBottomWidth: 1,
  },
  leftIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rowText: { flex: 1 },
  itemTitle: { fontSize: 17, fontWeight: "700", color: "#0F172A" },
  itemSubtitle: { fontSize: 13, color: "#6B7280", marginTop: 2 },

  // Bulk import modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  importModalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 8,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#F8F8FF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E6E6",
    fontSize: 16,
    color: "#0F172A",
  },
  inputHint: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },
  progressContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  progressText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 12,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  importButton: {
    overflow: "hidden",
  },
  importButtonDisabled: {
    opacity: 0.6,
  },
  importButtonGradient: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  importButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
