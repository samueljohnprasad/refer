import React, { useState } from "react";
import { Stack, YStack, XStack, Button, H2, Paragraph } from "tamagui";
import { RoleSelectionCard } from "../components/RoleSelectionCard";
import { UserRole } from "../types";
import { School, Users } from "@tamagui/lucide-icons";

interface RoleSelectionScreenProps {
  onNext: (role: UserRole) => void;
  onBack?: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onNext,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleNext = () => {
    if (selectedRole) {
      onNext(selectedRole);
    }
  };

  return (
    <YStack
      flex={1}
      padding="$5"
      maxWidth={500}
      width="100%"
      mx="auto"
      space="$4"
    >
      <YStack space="$2" marginBottom="$4">
        <H2>Choose your role</H2>
        <Paragraph color="$gray11">What role fits you best in this journey?</Paragraph>
      </YStack>

      <YStack space="$2" flex={1}>
        <RoleSelectionCard
          role="mentor"
          title="Mentor"
          description="I'm here to mentor and share my knowledge"
          icon={<Users size={24} color="$blue10" />}
          isSelected={selectedRole === "mentor"}
          onSelect={handleRoleSelect}
        />
        
        <RoleSelectionCard
          role="mentee"
          title="Mentee"
          description="I'm looking to learn and be mentored"
          icon={<School size={24} color="$blue10" />}
          onSelect={handleRoleSelect}
          isSelected={selectedRole === "mentee"}
        />
      </YStack>

      <XStack justifyContent="flex-end" paddingTop="$4">
        <Button
          theme="blue"
          size="$4"
          disabled={!selectedRole}
          onPress={handleNext}
          borderRadius="$4"
        >
          Next
        </Button>
      </XStack>
    </YStack>
  );
};
