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
    <YStack space="$2" marginBottom="$3">
      <Label htmlFor={label} fontSize="$3" color="$gray11">
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
        borderColor={error ? "$red8" : "$gray6"}
        borderWidth={1}
        padding="$3"
        borderRadius="$3"
        testID={testID}
        placeholderTextColor="$gray8"
      />
      {error && (
        <Text color="$red9" fontSize="$2">
          {error}
        </Text>
      )}
    </YStack>
  );
};
