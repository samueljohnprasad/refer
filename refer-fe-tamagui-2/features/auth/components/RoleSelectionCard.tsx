import React from "react";
import { Stack, Text, XStack, Radio, styled, H4, Paragraph } from "tamagui";
import { UserRole } from "../types";

interface RoleSelectionCardProps {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onSelect: (role: UserRole) => void;
}

const RoleCard = styled(Stack, {
  borderWidth: 1,
  borderColor: "$borderColor",
  borderRadius: "$4",
  padding: "$5",
  backgroundColor: "$background",
  flexDirection: "row",
  alignItems: "center",
  gap: "$4",
  marginVertical: "$2",
  variants: {
    selected: {
      true: {
        borderColor: "$blue10",
        backgroundColor: "$blue1",
      },
    },
  },
});

const IconContainer = styled(Stack, {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: "$blue2",
  justifyContent: "center",
  alignItems: "center",
});

export const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  role,
  title,
  description,
  icon,
  isSelected,
  onSelect,
}) => {
  return (
    <RoleCard 
      selected={isSelected}
      pressStyle={{ opacity: 0.9 }}
      onPress={() => onSelect(role)}
    >
      <IconContainer>{icon}</IconContainer>
      <Stack flex={1}>
        <Text fontWeight="600" fontSize="$5">{title}</Text>
        <Paragraph color="$gray10" fontSize="$3">{description}</Paragraph>
      </Stack>
      <Radio checked={isSelected} onCheckedChange={() => onSelect(role)}>
        <Radio.Indicator />
      </Radio>
    </RoleCard>
  );
};
