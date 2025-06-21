import React from "react";
import { Stack, Text, XStack, Paragraph, RadioGroup } from "tamagui";
import { UserRole } from "../types";

interface RoleSelectionCardProps {
    role: UserRole;
    title: string;
    description: string;
    icon: React.ReactNode;
    isSelected: boolean;
    onSelect: (role: UserRole) => void;
}

// Using Stack with inline styles instead of styled components to avoid token errors

export const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
    role,
    title,
    description,
    icon,
    isSelected,
    onSelect,
}) => {
    return (
        <Stack
            borderWidth={1}
            borderColor={isSelected ? "#3B82F6" : "#E5E7EB"}
            style={{
                borderRadius: 16,
                padding: 20,
                backgroundColor: isSelected ? "#EFF6FF" : "white",
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                marginVertical: 8,
            }}
            pressStyle={{ opacity: 0.9 }}
            onPress={() => onSelect(role)}
        >
            <Stack
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: "#EFF6FF",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {icon}
            </Stack>
            <Stack flex={1}>
                <Text
                    fontWeight="600"
                    fontSize="$5"
                >
                    {title}
                </Text>
                <Paragraph
                    style={{ color: "#999" }}
                    fontSize="$3"
                >
                    {description}
                </Paragraph>
            </Stack>
            <RadioGroup
                value={isSelected ? role : undefined}
                onValueChange={() => onSelect(role)}
            >
                <RadioGroup.Indicator />
            </RadioGroup>
        </Stack>
    );
};
