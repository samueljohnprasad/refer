import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
}) => {
  const handleClose = (): void => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <BlurView intensity={80} tint="dark" className="flex-1">
        <View className="flex-1 justify-center items-center px-5">
          {/* Modal Container */}
          <View className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <LinearGradient
              colors={["#7C3AED", "#A855F7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 20,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View className="flex-row items-center flex-1 gap-3">
                <View className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
                  <Feather name="shield" size={24} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold">
                    Privacy Policy
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    Last updated: November 2024
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={handleClose}
                className="w-10 h-10 rounded-full bg-white/20 items-center justify-center active:bg-white/30"
              >
                <Feather name="x" size={20} color="#FFF" />
              </Pressable>
            </LinearGradient>

            {/* Content */}
            <ScrollView
              className="px-6 py-5"
              showsVerticalScrollIndicator={true}
              style={{ maxHeight: 500 }}
            >
              {/* Introduction */}
              <Section title="Introduction">
                <Text className="text-gray-700 text-base leading-6">
                  Welcome to our mental health and journaling application. Your
                  privacy is critically important to us. This Privacy Policy
                  explains how we collect, use, store, and protect your personal
                  information and journal entries.
                </Text>
              </Section>

              {/* Information We Collect */}
              <Section title="Information We Collect">
                <SubSection title="Personal Information">
                  <BulletPoint text="Account information (name, email address)" />
                  <BulletPoint text="Profile details you choose to provide" />
                  <BulletPoint text="Device information (device type, OS version)" />
                </SubSection>

                <SubSection title="Journal & Mental Health Data">
                  <BulletPoint text="Journal entries and transcripts" />
                  <BulletPoint text="Mood tracking data and emotions" />
                  <BulletPoint text="AI-generated insights and analysis" />
                  <BulletPoint text="Activities, feelings, and wellness metrics" />
                  <BulletPoint text="Streaks and engagement statistics" />
                </SubSection>

                <SubSection title="Usage Data">
                  <BulletPoint text="App usage patterns and feature interactions" />
                  <BulletPoint text="Session duration and frequency" />
                  <BulletPoint text="Crash reports and error logs" />
                </SubSection>
              </Section>

              {/* How We Use Your Information */}
              <Section title="How We Use Your Information">
                <BulletPoint text="Provide personalized journaling and mental health tracking features" />
                <BulletPoint text="Generate AI-powered insights and recommendations" />
                <BulletPoint text="Maintain your journal history and mood patterns" />
                <BulletPoint text="Send notifications and reminders (if enabled)" />
                <BulletPoint text="Improve app functionality and user experience" />
                <BulletPoint text="Ensure security and prevent fraudulent activity" />
                <BulletPoint text="Comply with legal obligations" />
              </Section>

              {/* Data Storage & Security */}
              <Section title="Data Storage & Security">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  We take your privacy seriously and implement industry-standard
                  security measures:
                </Text>
                <BulletPoint text="End-to-end encryption for all journal entries" />
                <BulletPoint text="Secure cloud storage with encrypted backups" />
                <BulletPoint text="Data stored on secure servers with access controls" />
                <BulletPoint text="Regular security audits and vulnerability assessments" />
                <BulletPoint text="Your data is NEVER sold to third parties" />
              </Section>

              {/* AI Processing */}
              <Section title="AI Processing & Analysis">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  We use artificial intelligence to provide personalized
                  insights:
                </Text>
                <BulletPoint text="AI analysis is performed securely and privately" />
                <BulletPoint text="Your journal data is used only to generate YOUR insights" />
                <BulletPoint text="AI models do not retain or learn from your personal data" />
                <BulletPoint text="You can disable AI features at any time in settings" />
              </Section>

              {/* Data Sharing */}
              <Section title="Data Sharing & Disclosure">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  We do NOT share your personal journal entries or mental health
                  data with third parties, except:
                </Text>
                <BulletPoint text="With your explicit consent" />
                <BulletPoint text="When required by law or legal process" />
                <BulletPoint text="To protect rights, safety, or security" />
                <BulletPoint text="With service providers who assist in app operations (under strict confidentiality agreements)" />
              </Section>

              {/* Your Rights */}
              <Section title="Your Rights & Choices">
                <BulletPoint text="Access: View all your personal data and journal entries" />
                <BulletPoint text="Export: Download your data in a portable format" />
                <BulletPoint text="Delete: Permanently delete your account and all data" />
                <BulletPoint text="Correct: Update or correct your personal information" />
                <BulletPoint text="Opt-out: Disable notifications, AI features, or data collection" />
              </Section>

              {/* Data Retention */}
              <Section title="Data Retention">
                <Text className="text-gray-700 text-base leading-6">
                  We retain your data as long as your account is active. If you
                  delete your account, all personal data and journal entries are
                  permanently deleted within 30 days, except where we are
                  required by law to retain certain information.
                </Text>
              </Section>

              {/* Children's Privacy */}
              <Section title="Children's Privacy">
                <Text className="text-gray-700 text-base leading-6">
                  Our app is not intended for users under 13 years of age. We do
                  not knowingly collect personal information from children under
                  13. If you believe we have collected such information, please
                  contact us immediately.
                </Text>
              </Section>

              {/* Changes to Policy */}
              <Section title="Changes to This Policy">
                <Text className="text-gray-700 text-base leading-6">
                  We may update this Privacy Policy from time to time. We will
                  notify you of significant changes via email or in-app
                  notification. Your continued use of the app after changes
                  constitutes acceptance of the updated policy.
                </Text>
              </Section>

              {/* Contact */}
              <Section title="Contact Us" isLast>
                <Text className="text-gray-700 text-base leading-6">
                  If you have questions about this Privacy Policy or how we
                  handle your data, please contact us at:
                </Text>
                <View className="mt-3 bg-violet-50 rounded-xl p-4">
                  <Text className="text-violet-700 font-semibold text-base">
                    Email: privacy@yourapp.com
                  </Text>
                  <Text className="text-violet-600 text-sm mt-1">
                    We aim to respond within 48 hours
                  </Text>
                </View>
              </Section>
            </ScrollView>

            {/* Footer Button */}
            <View className="px-6 py-4 border-t border-gray-200">
              <TouchableOpacity
                onPress={handleClose}
                className="bg-violet-600 rounded-2xl py-4 items-center justify-center active:bg-violet-700"
                activeOpacity={0.8}
              >
                <Text className="text-white text-base font-bold">
                  I Understand
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

// Helper Components
interface SectionProps {
  title: string;
  children: React.ReactNode;
  isLast?: boolean;
}

const Section: React.FC<SectionProps> = ({
  title,
  children,
  isLast = false,
}) => {
  return (
    <View className={`${!isLast ? "mb-6" : ""}`}>
      <Text className="text-gray-900 text-lg font-bold mb-3">{title}</Text>
      {children}
    </View>
  );
};

interface SubSectionProps {
  title: string;
  children: React.ReactNode;
}

const SubSection: React.FC<SubSectionProps> = ({ title, children }) => {
  return (
    <View className="mb-3">
      <Text className="text-gray-800 text-base font-semibold mb-2">
        {title}:
      </Text>
      {children}
    </View>
  );
};

interface BulletPointProps {
  text: string;
}

const BulletPoint: React.FC<BulletPointProps> = ({ text }) => {
  return (
    <View className="flex-row mb-2">
      <Text className="text-violet-600 text-base mr-2">•</Text>
      <Text className="text-gray-700 text-base leading-6 flex-1">{text}</Text>
    </View>
  );
};

export default PrivacyPolicyModal;
