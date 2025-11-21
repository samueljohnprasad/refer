import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Linking,
  useWindowDimensions,
  Animated,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Stack, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";
import { useAuth } from "@/src/context/AuthContext";
import NameEditScreen from "../NameEditScreen/NameEditScreen";
import { useBulkImportJournals } from "@/hooks/post/useBulkImportJournals";
import { format, subDays } from "date-fns";
import PrivacyPolicyModal from "@/src/components/modals/PrivacyPolicyModal";
import TermsAndConditionsModal from "@/src/components/modals/TermsAndConditionsModal";
import EraseDataConfirmationModal from "@/src/components/modals/EraseDataConfirmationModal";
import SignOutConfirmationModal from "@/src/components/modals/SignOutConfirmationModal";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  AlertSquareIcon,
  ArrowLeft02Icon,
  ArrowRight01Icon,
  Delete02Icon,
  Download02Icon,
  File01Icon,
  Logout02Icon,
  MessageOutgoing01Icon,
  Notification01Icon,
  ShieldUserIcon,
  StarIcon,
  UserIcon,
} from "@hugeicons/core-free-icons";

export default React.memo(function SettingsScreen() {
  const [isSignoutOPen, setIsSignoutOPen] = useState(false);
  const router = useRouter();
  const { height } = useWindowDimensions();
  const headerHeight = useHeaderHeight();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { signOut, isSigningOut } = useAuth();

  const [showModal, setShowModal] = useState({
    modalType: "",
    showModal: false,
  });

  // Bulk import state
  const { bulkImport, importing, progress } = useBulkImportJournals();
  const [showImportModal, setShowImportModal] = useState(false);
  const [importDaysCount, setImportDaysCount] = useState("20");
  const [importStartDate] = useState<Date>(subDays(new Date(), 10));
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsAndConditions, setShowTermsAndConditions] = useState(false);
  const [showEraseDataModal, setShowEraseDataModal] = useState(false);
  const deleteUserDataMutation = useDeleteUser();

  const [upgradeY, setUpgradeY] = useState<number | null>(null);

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

  const handleEraseDataConfirm = async (): Promise<void> => {
    try {
      await deleteUserDataMutation.mutateAsync();
      setShowEraseDataModal(false);
      // Sign out after successful deletion
      await signOut();
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to delete your data. Please try again or contact support."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F8FF]" edges={["bottom"]}>
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
                className="flex-row items-center justify-between"
                style={{
                  height: height * 0.14,
                  paddingHorizontal: 16,
                  paddingBottom: 16,
                }}
              >
                <TouchableOpacity
                  className="w-10 h-10 rounded-full justify-center items-center bg-[#7C5CFF]"
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                >
                  <HugeiconsIcon
                    icon={ArrowLeft02Icon}
                    size={20}
                    color="#FFF"
                  />
                </TouchableOpacity>

                <Text className="text-[28px] font-extrabold text-[#0F172A]">
                  Settings
                </Text>
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
                        className="self-start rounded-[28px]"
                        style={{ paddingVertical: 8, paddingHorizontal: 14 }}
                      >
                        <Text className="text-white font-bold text-[15px]">
                          Upgrade
                        </Text>
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
      <View className="flex-1 px-0">
        <Animated.ScrollView
          contentContainerClassName="flex-grow px-4"
          contentContainerStyle={{
            paddingTop: headerHeight,
            paddingBottom: 24,
          }}
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
          <View className="bg-[#FFED6B] rounded-[18px] p-4 flex-row items-center mb-[18px]">
            <View style={{ flex: 1 }}>
              <Text className="text-[22px] font-extrabold text-[#0B1220] mb-1.5">
                Unlock All Features
              </Text>
              <Text
                className="text-[#374151] text-[13.5px] leading-[19px] mb-3"
                numberOfLines={3}
              >
                AI Insights, Weekly Summaries,{"\n"}Advanced Dashboard,{"\n"}
                Longer Recordings, and more.
              </Text>

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
                  className="self-start py-2.5 px-[18px] rounded-[28px]"
                >
                  <Text className="text-white font-bold text-[15px]">
                    Upgrade to Premium
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          <View className="bg-white rounded-2xl overflow-hidden">
            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                router.push("/tabs/screens/reminders" as any);
              }}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#E9D5FF]">
                <HugeiconsIcon
                  icon={Notification01Icon}
                  size={20}
                  color="#A855F7"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Daily Reminders
                </Text>
                <Text className="text-[13px] text-[#6B7280] mt-0.5">
                  Customize multiple reminders
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={() => {
                handlePress("edit-name");
              }}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#FECACA]">
                <HugeiconsIcon icon={UserIcon} size={20} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Edit Name
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={() => {
                handlePress("contact-support");
              }}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#CFFAFE]">
                <HugeiconsIcon
                  icon={MessageOutgoing01Icon}
                  size={20}
                  color="#06B6D4"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Contact Support
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={handleRateUs}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#DCFCE7]">
                <HugeiconsIcon icon={StarIcon} size={20} color="#16A34A" />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Rate Us
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          </View>

          {/* Settings Group 2 */}
          <View className="bg-white rounded-2xl overflow-hidden mt-[14px]">
            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                setShowTermsAndConditions(true);
              }}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#F3E8FF]">
                <HugeiconsIcon icon={File01Icon} size={20} color="#9333EA" />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Terms of Use
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                setShowPrivacyPolicy(true);
              }}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#DBEAFE]">
                <HugeiconsIcon
                  icon={ShieldUserIcon}
                  size={20}
                  color="#2563EB"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Privacy Policy
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                setShowEraseDataModal(true);
              }}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#FEE2E2]">
                <HugeiconsIcon icon={Delete02Icon} size={20} color="#DC2626" />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Erase Personal Data
                </Text>
                <Text className="text-[13px] text-[#6B7280] mt-0.5">
                  Permanently delete all data
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>

            <View className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]">
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#FEF3C7]">
                <HugeiconsIcon
                  icon={AlertSquareIcon}
                  size={20}
                  color="#D97706"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  App Info
                </Text>
                <Text className="text-[13px] text-[#6B7280] mt-0.5">
                  Version 1.0.0 (Build 1)
                </Text>
              </View>
            </View>

            <TouchableOpacity
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
              activeOpacity={0.7}
              onPress={() => {
                Haptics.selectionAsync();
                setShowImportModal(true);
              }}
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#E9D5FF]">
                <HugeiconsIcon
                  icon={Download02Icon}
                  size={20}
                  color="#9333EA"
                />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Bulk Import Journals
                </Text>
                <Text className="text-[13px] text-[#6B7280] mt-0.5">
                  Import sample data
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setIsSignoutOPen(true);
              }}
              className="flex-row items-center py-3.5 px-4 border-b border-[#F0F0F3]"
            >
              <View className="w-9 h-9 rounded-[18px] justify-center items-center mr-3 bg-[#BFDBFE]">
                <HugeiconsIcon icon={Logout02Icon} size={20} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-[17px] font-bold text-[#0F172A]">
                  Sign Out
                </Text>
              </View>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={22}
                color="#9CA3AF"
              />
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
        animationType="fade"
        transparent={true}
        visible={showImportModal}
        onRequestClose={() => !importing && setShowImportModal(false)}
      >
        <BlurView
          intensity={20}
          tint="dark"
          className="flex-1 justify-center items-center px-5"
        >
          <View className="bg-white rounded-3xl p-6 w-full max-w-[400px] shadow-lg shadow-black/30">
            <Text className="text-2xl font-extrabold text-[#0F172A] mb-2">
              Bulk Import Journals
            </Text>
            <Text className="text-[15px] text-[#6B7280] mb-6">
              Import sample journal entries for testing
            </Text>

            <View className="mb-5">
              <Text className="text-[15px] font-semibold text-[#0F172A] mb-2">
                Start Date
              </Text>
              <View className="flex-row items-center bg-[#F8F8FF] p-3.5 rounded-xl border border-[#E6E6E6] gap-2.5">
                <Feather name="calendar" size={18} color="#7C5CFF" />
                <Text className="text-base text-[#0F172A] font-medium">
                  {format(importStartDate, "MMM dd, yyyy")}
                </Text>
              </View>
              <Text className="text-[13px] text-[#6B7280] mt-1.5">
                Entries will be created from this date forward
              </Text>
            </View>

            <View className="mb-5">
              <Text className="text-[15px] font-semibold text-[#0F172A] mb-2">
                Number of Days (1-20)
              </Text>
              <TextInput
                className="bg-[#F8F8FF] p-3.5 rounded-xl border border-[#E6E6E6] text-base text-[#0F172A]"
                value={importDaysCount}
                onChangeText={setImportDaysCount}
                keyboardType="number-pad"
                placeholder="20"
                maxLength={2}
                editable={!importing}
              />
              <Text className="text-[13px] text-[#6B7280] mt-1.5">
                {importDaysCount}{" "}
                {parseInt(importDaysCount) === 1 ? "entry" : "entries"} will be
                imported
              </Text>
            </View>

            {importing && (
              <View className="items-center py-5">
                <ActivityIndicator size="large" color="#7C5CFF" />
                <Text className="text-[15px] text-[#6B7280] mt-3">
                  Importing {progress.current} of {progress.total}...
                </Text>
              </View>
            )}

            <View className="flex-row gap-3 mt-2">
              <TouchableOpacity
                className="flex-1 rounded-2xl overflow-hidden bg-[#F3F4F6] py-3.5 items-center justify-center"
                onPress={() => setShowImportModal(false)}
                disabled={importing}
              >
                <Text className="text-base font-semibold text-[#6B7280]">
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-1 rounded-2xl overflow-hidden ${
                  importing ? "opacity-60" : ""
                }`}
                onPress={handleBulkImport}
                disabled={importing}
              >
                <LinearGradient
                  colors={importing ? ["#999", "#777"] : ["#7C5CFF", "#9C7CFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="py-3.5 items-center justify-center rounded-2xl"
                >
                  <Text className="text-base font-bold text-white">
                    {importing ? "Importing..." : "Import"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        visible={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
      />

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        visible={showTermsAndConditions}
        onClose={() => setShowTermsAndConditions(false)}
      />

      {/* Erase Data Confirmation Modal */}
      <EraseDataConfirmationModal
        visible={showEraseDataModal}
        onClose={() => setShowEraseDataModal(false)}
        onConfirm={handleEraseDataConfirm}
        isDeleting={deleteUserDataMutation.isPending}
      />

      <SignOutConfirmationModal
        isSignoutOPen={isSignoutOPen}
        handleClose={() => {
          if (!isSigningOut) {
            setIsSignoutOPen(false);
          }
        }}
        onConfirm={signOut}
        isLoading={isSigningOut}
      />
    </SafeAreaView>
  );
});
