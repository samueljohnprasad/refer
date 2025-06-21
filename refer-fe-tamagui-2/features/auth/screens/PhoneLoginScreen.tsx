import React, { useState } from "react";
import { Button, YStack, XStack, H2, Paragraph, Text, Form } from "tamagui";
import { InputField } from "../components/InputField";
import { AuthFormValues } from "../types";
import { ArrowRight, ArrowLeft } from "@tamagui/lucide-icons";

interface PhoneLoginScreenProps {
    onPhoneLogin: (values: AuthFormValues) => void;
    onVerifyOTP: (values: AuthFormValues) => void;
    onBackToMainLogin: () => void;
    isLoading?: boolean;
}

export const PhoneLoginScreen: React.FC<PhoneLoginScreenProps> = ({
    onPhoneLogin,
    onVerifyOTP,
    onBackToMainLogin,
    isLoading = false,
}) => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; otp?: string }>({});

    const validatePhone = (): boolean => {
        if (!phone) {
            setErrors({ phone: "Phone number is required" });
            return false;
        } else if (!/^\d{10}$/.test(phone)) {
            setErrors({ phone: "Please enter a valid 10-digit phone number" });
            return false;
        }
        setErrors({});
        return true;
    };

    const validateOtp = (): boolean => {
        if (!otp) {
            setErrors({ otp: "OTP is required" });
            return false;
        } else if (!/^\d{6}$/.test(otp)) {
            setErrors({ otp: "OTP must be 6 digits" });
            return false;
        }
        setErrors({});
        return true;
    };

    const handleSendOTP = () => {
        if (validatePhone()) {
            onPhoneLogin({ phone, email: "", password: "" });
            setOtpSent(true);
        }
    };

    const handleVerifyOTP = () => {
        if (validateOtp()) {
            onVerifyOTP({ phone, otp, email: "", password: "" });
        }
    };

    return (
        <YStack
            p="$5"
            maxW={500}
            width="100%"
            mx="auto"
            space="$4"
            flex={1}
        >
            <XStack
                items="center"
                mb="$2"
            >
                <Button
                    icon={ArrowLeft}
                    size="$3"
                    mr="$2"
                    onPress={onBackToMainLogin}
                    bg="transparent"
                    style={{ borderRadius: 16 }}
                />
                <H2>{otpSent ? "Verify OTP" : "Login with Phone"}</H2>
            </XStack>

            <Paragraph
                color="$blue10"
                mb="$4"
            >
                {otpSent
                    ? "Enter the 6-digit code sent to your phone"
                    : "We'll send you a one-time password"}
            </Paragraph>

            <Form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP}>
                {!otpSent ? (
                    <InputField
                        label="Phone Number"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChangeText={setPhone}
                        error={errors.phone}
                        keyboardType="phone-pad"
                        testID="phone-input"
                    />
                ) : (
                    <YStack space="$2">
                        <Text
                            fontSize="$3"
                            fontWeight="500"
                        >
                            Enter OTP sent to +{phone}
                        </Text>
                        <InputField
                            label="One-Time Password"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChangeText={setOtp}
                            error={errors.otp}
                            keyboardType="numeric"
                            testID="otp-input"
                        />
                        <XStack justify="flex-end">
                            <Text
                                color="$blue10"
                                fontSize="$3"
                                fontWeight="500"
                                onPress={handleSendOTP}
                            >
                                Resend OTP
                            </Text>
                        </XStack>
                    </YStack>
                )}

                <Button
                    size="$4"
                    theme="blue"
                    my="$5"
                    onPress={otpSent ? handleVerifyOTP : handleSendOTP}
                    disabled={isLoading}
                    icon={isLoading ? undefined : ArrowRight}
                    style={{ borderRadius: 16 }}
                >
                    {isLoading
                        ? "Processing..."
                        : otpSent
                        ? "Verify & Login"
                        : "Send OTP"}
                </Button>
            </Form>
        </YStack>
    );
};
