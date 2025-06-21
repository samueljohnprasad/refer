import React, { useState } from "react";
import { Button, YStack, XStack, H2, Paragraph, Text, Form } from "tamagui";
import { InputField } from "../components/InputField";
import { AuthFormValues } from "../types";
import { ArrowRight } from "@tamagui/lucide-icons";

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
      p="$5"
      width="100%"
      mx="auto"
      space="$4"
      flex={1}
      style={{ maxWidth: 500 }}
    >
      <YStack space="$2" mb="$4">
        <H2>Welcome back</H2>
        <Paragraph style={{ color: "#999" }}>Log in to your account</Paragraph>
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

        <YStack mb="$4" style={{ alignItems: "flex-end" }}>
          <Text
            style={{ 
              color: "#3B82F6",
              fontSize: 14,
              fontWeight: "500"
            }}
            onPress={() => {}}
          >
            Forgot password?
          </Text>
        </YStack>

        <Button
          size="$4"
          theme="blue"
          my="$3"
          onPress={handleSubmit}
          disabled={isLoading}
          icon={isLoading ? undefined : ArrowRight}
          style={{ borderRadius: 16 }}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </Form>

      <YStack space="$4" mt="$4">
        <Text style={{ color: "#999", textAlign: "center" }}>
          Or continue with
        </Text>
        
        <XStack space="$3" justify="center">
          <Button
            size="$4"
            flex={1}
            borderColor="$borderColor"
            borderWidth={1}
            bg="transparent"
            onPress={onPhoneLoginClick}
            style={{ borderRadius: 16 }}
          >
            Phone
          </Button>
          <Button
            size="$4"
            flex={1}
            borderColor="$borderColor"
            borderWidth={1}
            bg="transparent"
            onPress={onWhatsAppLoginClick}
            style={{ borderRadius: 16 }}
          >
            WhatsApp
          </Button>
        </XStack>
      </YStack>

      <YStack mt="auto" py="$4" style={{ alignItems: "center", justifyContent: "center" }}>
        <XStack>
          <Text style={{ color: "#999" }}>Don't have an account?</Text>
          <Text
            style={{
              color: "#3B82F6",
              fontWeight: "500",
              marginLeft: 8
            }}
            onPress={onSignupClick}
          >
            Sign up
          </Text>
        </XStack>
      </YStack>
    </YStack>
  );
};
