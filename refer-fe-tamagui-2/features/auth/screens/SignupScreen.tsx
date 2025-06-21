import React, { useState } from "react";
import { Button, YStack, XStack, H2, Paragraph, Text, Form } from "tamagui";
import { InputField } from "../components/InputField";
import { AuthFormValues } from "../types";
import { ArrowRight } from "@tamagui/lucide-icons";

interface SignupScreenProps {
  onSignup: (values: AuthFormValues) => void;
  onLoginClick: () => void;
  onPhoneSignupClick: () => void;
  onWhatsAppSignupClick: () => void;
  isLoading?: boolean;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({
  onSignup,
  onLoginClick,
  onPhoneSignupClick,
  onWhatsAppSignupClick,
  isLoading = false,
}) => {
  const [values, setValues] = useState<AuthFormValues>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<AuthFormValues & { confirmPassword: string }>>({});

  const validate = (): boolean => {
    const newErrors: Partial<AuthFormValues & { confirmPassword: string }> = {};
    
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
    
    if (!values.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSignup(values);
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
        <H2>Create an account</H2>
        <Paragraph color="$gray11">Sign up to get started</Paragraph>
      </YStack>

      <Form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          placeholder="your@email.com"
          value={values.email}
          onChangeText={(text) => setValues({ ...values, email: text })}
          error={errors.email}
          keyboardType="email-address"
          testID="signup-email-input"
        />

        <InputField
          label="Password"
          placeholder="Create a password"
          value={values.password}
          onChangeText={(text) => setValues({ ...values, password: text })}
          error={errors.password}
          secureTextEntry
          testID="signup-password-input"
        />

        <InputField
          label="Confirm Password"
          placeholder="Confirm your password"
          value={values.confirmPassword || ""}
          onChangeText={(text) => setValues({ ...values, confirmPassword: text })}
          error={errors.confirmPassword}
          secureTextEntry
          testID="signup-confirm-password-input"
        />

        <Button
          size="$4"
          theme="blue"
          marginVertical="$3"
          onPress={handleSubmit}
          disabled={isLoading}
          icon={isLoading ? undefined : ArrowRight}
          borderRadius="$4"
        >
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>
      </Form>

      <YStack space="$4" marginTop="$4">
        <Text textAlign="center" color="$gray11">
          Or sign up with
        </Text>
        
        <XStack space="$3" justifyContent="center">
          <Button
            size="$4"
            flex={1}
            borderColor="$gray6"
            borderWidth={1}
            backgroundColor="transparent"
            onPress={onPhoneSignupClick}
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
            onPress={onWhatsAppSignupClick}
            borderRadius="$4"
          >
            WhatsApp
          </Button>
        </XStack>
      </YStack>

      <YStack marginTop="auto" alignItems="center" paddingVertical="$4">
        <XStack>
          <Text color="$gray11">Already have an account?</Text>
          <Text
            color="$blue10"
            fontWeight="500"
            onPress={onLoginClick}
            marginLeft="$2"
          >
            Sign in
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
};
