import React from "react";
import { Input, Label, Text, YStack } from "tamagui";

interface InputFieldProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    testID?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    secureTextEntry = false,
    keyboardType = "default",
    autoCapitalize = "none",
    testID,
}) => {
    return (
        <YStack
            space="$2"
            mb="$3"
        >
            <Label
                htmlFor={label}
                fontSize="$3"
                color="$blue10"
            >
                {label}
            </Label>
            <Input
                id={label}
                value={value}
                placeholder={placeholder}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize={autoCapitalize}
                borderColor={error ? "$red9" : "$blue10"}
                borderWidth={1}
                p="$3"
                style={{ borderRadius: 16 }}
                testID={testID}
                // placeholderTextColor="$gray8"
            />
            {error && (
                <Text
                    color="$red9"
                    fontSize="$2"
                >
                    {error}
                </Text>
            )}
        </YStack>
    );
};
