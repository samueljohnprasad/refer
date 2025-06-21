import React, { useState } from "react";
import { Button, YStack, XStack, H2, Paragraph, Text, Form } from "tamagui";
import { InputField } from "../components/InputField";
import { AuthFormValues } from "../types";
import { Mail, Lock, ArrowRight } from "@tamagui/lucide-icons";

interface LoginScreenProps {
  onLogin: (values: AuthFormValues) => void;
  onSignupClick: () => void;
  onPhoneLoginClick: () => void;
  onWhatsAppLoginClick: () => void;
  isLoading?: boolean;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onSignupClick,
  onPhoneLoginClick,
  onWhatsAppLoginClick,
  isLoading = false,
}) => {
  const [values, setValues] = useState<AuthFormValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<AuthFormValues>>({});

  const validate = (): boolean => {
    const newErrors: Partial<AuthFormValues> = {};
    
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!values.password) {
      newErrors.password = "Password is required";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onLogin(values);
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
      <YStack space="$2" marginBottom="$4">
        <H2>Welcome back</H2>
        <Paragraph color="$gray11">Log in to your account</Paragraph>
      </YStack>

      <Form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          placeholder="your@email.com"
          value={values.email}
          onChangeText={(text) => setValues({ ...values, email: text })}
          error={errors.email}
          keyboardType="email-address"
          testID="login-email-input"
        />

        <InputField
          label="Password"
          placeholder="Enter your password"
          value={values.password}
          onChangeText={(text) => setValues({ ...values, password: text })}
          error={errors.password}
          secureTextEntry
          testID="login-password-input"
        />

        <YStack alignItems="flex-end" marginBottom="$4">
          <Text
            color="$blue10"
            fontSize="$3"
            fontWeight="500"
            onPress={() => {}}
          >
            Forgot password?
          </Text>
        </YStack>

        <Button
          size="$4"
          theme="blue"
          marginVertical="$3"
          onPress={handleSubmit}
          disabled={isLoading}
          icon={isLoading ? undefined : ArrowRight}
          borderRadius="$4"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </Form>

      <YStack space="$4" marginTop="$4">
        <Text textAlign="center" color="$gray11">
          Or continue with
        </Text>
        
        <XStack space="$3" justifyContent="center">
          <Button
            size="$4"
            flex={1}
            borderColor="$gray6"
            borderWidth={1}
            backgroundColor="transparent"
            onPress={onPhoneLoginClick}
            borderRadius="$4"
          >
            Phone
          </Button>
          <Button
            size="$4"
            flex={1}
            borderColor="$gray6"
            borderWidth={1}
            backgroundColor="transparent"
            onPress={onWhatsAppLoginClick}
            borderRadius="$4"
          >
            WhatsApp
          </Button>
        </XStack>
      </YStack>

      <YStack marginTop="auto" alignItems="center" paddingVertical="$4">
        <XStack>
          <Text color="$gray11">Don't have an account?</Text>
          <Text
            color="$blue10"
            fontWeight="500"
            onPress={onSignupClick}
            marginLeft="$2"
          >
            Sign up
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
};
