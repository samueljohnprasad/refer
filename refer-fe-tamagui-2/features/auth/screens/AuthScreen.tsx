import React, { useState } from "react";
import { YStack } from "tamagui";
import { LoginScreen } from "./LoginScreen";
import { SignupScreen } from "./SignupScreen";
import { PhoneLoginScreen } from "./PhoneLoginScreen";
import { WhatsAppLoginScreen } from "./WhatsAppLoginScreen";
import { RoleSelectionScreen } from "./RoleSelectionScreen";
import { AuthFormValues, UserRole } from "../types";

type AuthScreenType = "login" | "signup" | "phone" | "whatsapp" | "role-selection";

interface AuthScreenProps {
  initialScreen?: AuthScreenType;
  onAuthSuccess?: (role: UserRole) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialScreen = "login",
  onAuthSuccess,
}) => {
  const [currentScreen, setCurrentScreen] = useState<AuthScreenType>(initialScreen);
  const [isLoading, setIsLoading] = useState(false);
  const [authData, setAuthData] = useState<{
    email?: string;
    phone?: string;
    isAuthenticated: boolean;
  }>({
    isAuthenticated: false,
  });

  // Authentication handlers
  const handleLogin = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Login with:", values);
      setAuthData({
        email: values.email,
        isAuthenticated: true,
      });
      
      // After login, move to role selection
      setCurrentScreen("role-selection");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Signup with:", values);
      setAuthData({
        email: values.email,
        isAuthenticated: true,
      });
      
      // After signup, move to role selection
      setCurrentScreen("role-selection");
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLogin = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      // Simulated API call to send OTP - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Phone login - send OTP to:", values.phone);
      setAuthData({
        phone: values.phone,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error("Phone login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      // Simulated API call to verify OTP - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Verify OTP:", values.otp, "for phone:", values.phone);
      setAuthData({
        phone: values.phone,
        isAuthenticated: true,
      });
      
      // After OTP verification, move to role selection
      setCurrentScreen("role-selection");
    } catch (error) {
      console.error("OTP verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsAppLogin = async (values: AuthFormValues) => {
    setIsLoading(true);
    try {
      // Simulated API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("WhatsApp login with:", values.phone);
      setAuthData({
        phone: values.phone,
        isAuthenticated: true,
      });
      
      // After WhatsApp authentication, move to role selection
      setCurrentScreen("role-selection");
    } catch (error) {
      console.error("WhatsApp login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    console.log("Selected role:", role);
    
    // Call the onAuthSuccess callback with the selected role
    if (onAuthSuccess) {
      onAuthSuccess(role);
    }
  };

  // Screen navigation handlers
  const navigateToLogin = () => setCurrentScreen("login");
  const navigateToSignup = () => setCurrentScreen("signup");
  const navigateToPhoneLogin = () => setCurrentScreen("phone");
  const navigateToWhatsAppLogin = () => setCurrentScreen("whatsapp");

  // Render the current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "login":
        return (
          <LoginScreen
            onLogin={handleLogin}
            onSignupClick={navigateToSignup}
            onPhoneLoginClick={navigateToPhoneLogin}
            onWhatsAppLoginClick={navigateToWhatsAppLogin}
            isLoading={isLoading}
          />
        );
      case "signup":
        return (
          <SignupScreen
            onSignup={handleSignup}
            onLoginClick={navigateToLogin}
            onPhoneSignupClick={navigateToPhoneLogin}
            onWhatsAppSignupClick={navigateToWhatsAppLogin}
            isLoading={isLoading}
          />
        );
      case "phone":
        return (
          <PhoneLoginScreen
            onPhoneLogin={handlePhoneLogin}
            onVerifyOTP={handleVerifyOTP}
            onBackToMainLogin={navigateToLogin}
            isLoading={isLoading}
          />
        );
      case "whatsapp":
        return (
          <WhatsAppLoginScreen
            onWhatsAppLogin={handleWhatsAppLogin}
            onBackToMainLogin={navigateToLogin}
            isLoading={isLoading}
          />
        );
      case "role-selection":
        return <RoleSelectionScreen onNext={handleRoleSelection} onBack={navigateToLogin} />;
      default:
        return <LoginScreen 
          onLogin={handleLogin}
          onSignupClick={navigateToSignup}
          onPhoneLoginClick={navigateToPhoneLogin}
          onWhatsAppLoginClick={navigateToWhatsAppLogin}
          isLoading={isLoading}
        />;
    }
  };

  return (
    <YStack flex={1} bg="$background">
      {renderCurrentScreen()}
    </YStack>
  );
};
