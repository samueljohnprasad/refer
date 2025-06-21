import React, { useState } from "react";
import { Button, YStack, XStack, H2, Paragraph, Text, Form } from "tamagui";
import { InputField } from "../components/InputField";
import { AuthFormValues } from "../types";
import { ArrowRight, ArrowLeft } from "@tamagui/lucide-icons";

interface WhatsAppLoginScreenProps {
  onWhatsAppLogin: (values: AuthFormValues) => void;
  onBackToMainLogin: () => void;
  isLoading?: boolean;
}

export const WhatsAppLoginScreen: React.FC<WhatsAppLoginScreenProps> = ({
  onWhatsAppLogin,
  onBackToMainLogin,
  isLoading = false,
}) => {
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ phone?: string }>({});

  const validatePhone = (): boolean => {
    if (!phone) {
      setErrors({ phone: "WhatsApp number is required" });
      return false;
    } else if (!/^\d{10}$/.test(phone)) {
      setErrors({ phone: "Please enter a valid 10-digit WhatsApp number" });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleLogin = () => {
    if (validatePhone()) {
      onWhatsAppLogin({ phone, email: "", password: "" });
    }
  };

  return (
    <YStack
      padding="$5"
      maxWidth={500}
      width="100%"
      mx="auto"
      space="$4"
      flex={1}
    >
      <XStack alignItems="center" marginBottom="$2">
        <Button
          icon={ArrowLeft}
          size="$3"
          marginRight="$2"
          onPress={onBackToMainLogin}
          backgroundColor="transparent"
          borderRadius="$4"
        />
        <H2>Login with WhatsApp</H2>
      </XStack>

      <Paragraph color="$gray11" marginBottom="$4">
        Enter your WhatsApp number to receive authentication message
      </Paragraph>

      <Form onSubmit={handleLogin}>
        <InputField
          label="WhatsApp Number"
          placeholder="Enter your WhatsApp number"
          value={phone}
          onChangeText={setPhone}
          error={errors.phone}
          keyboardType="phone-pad"
          testID="whatsapp-input"
        />

        <YStack space="$2" marginTop="$2">
          <Text color="$gray10" fontSize="$2">
            We'll send a WhatsApp message with a verification link to this number
          </Text>
        </YStack>

        <Button
          size="$4"
          theme="blue"
          marginVertical="$5"
          onPress={handleLogin}
          disabled={isLoading}
          icon={isLoading ? undefined : ArrowRight}
          borderRadius="$4"
        >
          {isLoading ? "Processing..." : "Continue with WhatsApp"}
        </Button>
      </Form>
    </YStack>
  );
};
