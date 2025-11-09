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

interface TermsAndConditionsModalProps {
  visible: boolean;
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
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
                  <Feather name="file-text" size={24} color="#FFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold">
                    Terms & Conditions
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
              <Section title="Agreement to Terms">
                <Text className="text-gray-700 text-base leading-6">
                  By accessing and using this mental health and journaling
                  application ("the App"), you agree to be bound by these Terms
                  and Conditions. If you do not agree with any part of these
                  terms, you must not use the App.
                </Text>
              </Section>

              {/* Account Registration */}
              <Section title="Account Registration & Eligibility">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  To use certain features of the App, you must create an
                  account:
                </Text>
                <BulletPoint text="You must be at least 13 years old to use this App" />
                <BulletPoint text="You must provide accurate and complete information" />
                <BulletPoint text="You are responsible for maintaining account security" />
                <BulletPoint text="You must not share your account credentials" />
                <BulletPoint text="One account per person - multiple accounts are prohibited" />
                <BulletPoint text="We reserve the right to refuse service or terminate accounts" />
              </Section>

              {/* Acceptable Use */}
              <Section title="Acceptable Use Policy">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  You agree NOT to use the App to:
                </Text>
                <BulletPoint text="Violate any local, state, national, or international law" />
                <BulletPoint text="Harass, threaten, or harm others" />
                <BulletPoint text="Share harmful, abusive, or inappropriate content" />
                <BulletPoint text="Attempt to hack, reverse engineer, or compromise the App" />
                <BulletPoint text="Upload viruses, malware, or malicious code" />
                <BulletPoint text="Collect personal data from other users" />
                <BulletPoint text="Use the App for commercial purposes without authorization" />
                <BulletPoint text="Impersonate others or misrepresent your identity" />
              </Section>

              {/* Medical Disclaimer */}
              <Section title="Medical Disclaimer">
                <View className="bg-red-50 rounded-xl p-4 mb-3">
                  <Text className="text-red-800 font-bold text-base mb-2">
                    ⚠️ Important Notice
                  </Text>
                  <Text className="text-red-700 text-sm leading-5">
                    This App is NOT a substitute for professional medical
                    advice, diagnosis, or treatment. Always seek the advice of
                    qualified healthcare providers with any questions regarding
                    mental health conditions.
                  </Text>
                </View>
                <BulletPoint text="The App provides tools for self-reflection and mood tracking" />
                <BulletPoint text="AI insights are for informational purposes only" />
                <BulletPoint text="Do not use the App for medical emergencies" />
                <BulletPoint text="If you're in crisis, contact emergency services or a crisis hotline immediately" />
                <BulletPoint text="We are not liable for any health outcomes related to App use" />
              </Section>

              {/* Content Ownership */}
              <Section title="Content & Intellectual Property">
                <SubSection title="Your Content">
                  <BulletPoint text="You retain ownership of your journal entries and personal data" />
                  <BulletPoint text="You grant us a license to process your content for app functionality" />
                  <BulletPoint text="You are responsible for the content you create" />
                  <BulletPoint text="We may remove content that violates these terms" />
                </SubSection>

                <SubSection title="Our Content">
                  <BulletPoint text="The App's design, features, and AI technology are our property" />
                  <BulletPoint text="You may not copy, modify, or distribute our content" />
                  <BulletPoint text="All trademarks and logos belong to us" />
                  <BulletPoint text="Unauthorized use may result in legal action" />
                </SubSection>
              </Section>

              {/* Subscription & Payment */}
              <Section title="Subscription & Payment Terms">
                <SubSection title="Premium Subscription">
                  <BulletPoint text="Premium features require a paid subscription" />
                  <BulletPoint text="Subscription fees are billed monthly or annually" />
                  <BulletPoint text="Prices are subject to change with 30 days notice" />
                  <BulletPoint text="All payments are processed securely through app stores" />
                </SubSection>

                <SubSection title="Cancellation & Refunds">
                  <BulletPoint text="You may cancel your subscription at any time" />
                  <BulletPoint text="Cancellation takes effect at the end of the billing period" />
                  <BulletPoint text="No refunds for partial subscription periods" />
                  <BulletPoint text="Refund requests are handled by the app store (Apple/Google)" />
                </SubSection>
              </Section>

              {/* Data Usage & AI */}
              <Section title="AI Processing & Data Usage">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  By using AI features, you agree that:
                </Text>
                <BulletPoint text="Your journal entries may be analyzed by AI to generate insights" />
                <BulletPoint text="AI processing is performed securely and privately" />
                <BulletPoint text="We do not use your data to train AI models for other users" />
                <BulletPoint text="AI insights are algorithmic suggestions, not professional advice" />
                <BulletPoint text="You can opt-out of AI features in settings" />
              </Section>

              {/* Limitation of Liability */}
              <Section title="Limitation of Liability">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  To the maximum extent permitted by law:
                </Text>
                <BulletPoint text="The App is provided 'AS IS' without warranties of any kind" />
                <BulletPoint text="We are not liable for any indirect, incidental, or consequential damages" />
                <BulletPoint text="We do not guarantee uninterrupted or error-free service" />
                <BulletPoint text="Our total liability shall not exceed the amount you paid in the last 12 months" />
                <BulletPoint text="Some jurisdictions do not allow liability limitations" />
              </Section>

              {/* Termination */}
              <Section title="Account Termination">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  We may suspend or terminate your account if:
                </Text>
                <BulletPoint text="You violate these Terms and Conditions" />
                <BulletPoint text="You engage in fraudulent or abusive behavior" />
                <BulletPoint text="You fail to pay subscription fees" />
                <BulletPoint text="We discontinue the App or service" />
                <Text className="text-gray-700 text-base leading-6 mt-3">
                  You may delete your account at any time from Settings. Upon
                  termination, all your data will be permanently deleted within
                  30 days.
                </Text>
              </Section>

              {/* Changes to Terms */}
              <Section title="Changes to Terms">
                <Text className="text-gray-700 text-base leading-6">
                  We reserve the right to modify these Terms at any time. We
                  will notify you of significant changes via email or in-app
                  notification. Continued use of the App after changes
                  constitutes acceptance of the updated Terms.
                </Text>
              </Section>

              {/* Governing Law */}
              <Section title="Governing Law & Dispute Resolution">
                <Text className="text-gray-700 text-base leading-6 mb-3">
                  These Terms are governed by the laws of [Your Jurisdiction]:
                </Text>
                <BulletPoint text="Any disputes shall be resolved through binding arbitration" />
                <BulletPoint text="You waive the right to participate in class actions" />
                <BulletPoint text="Legal proceedings must be filed in [Jurisdiction]" />
                <BulletPoint text="For EU users, local consumer protection laws apply" />
              </Section>

              {/* Third-Party Services */}
              <Section title="Third-Party Services">
                <Text className="text-gray-700 text-base leading-6">
                  The App may integrate with third-party services (analytics,
                  payment processors, AI providers). Your use of these services
                  is subject to their own terms and policies. We are not
                  responsible for third-party services.
                </Text>
              </Section>

              {/* Severability */}
              <Section title="Severability">
                <Text className="text-gray-700 text-base leading-6">
                  If any provision of these Terms is found to be unenforceable,
                  the remaining provisions shall remain in full force and
                  effect.
                </Text>
              </Section>

              {/* Contact */}
              <Section title="Contact Us" isLast>
                <Text className="text-gray-700 text-base leading-6">
                  If you have questions about these Terms and Conditions, please
                  contact us at:
                </Text>
                <View className="mt-3 bg-violet-50 rounded-xl p-4">
                  <Text className="text-violet-700 font-semibold text-base">
                    Email: legal@yourapp.com
                  </Text>
                  <Text className="text-violet-600 text-sm mt-1">
                    Support: support@yourapp.com
                  </Text>
                  <Text className="text-violet-600 text-sm mt-1">
                    We respond within 48 hours
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
                  I Agree to These Terms
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

export default TermsAndConditionsModal;
