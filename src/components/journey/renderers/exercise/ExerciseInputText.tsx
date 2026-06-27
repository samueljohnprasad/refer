/**
 * ExerciseInputText
 * Multi-line text input for exercise steps.
 * Features: character encouragement, placeholder, keyboard-aware.
 */

import React from "react";
import { View, TextInput } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { INK_MUTED } from "@/lib/tokens";
import { RendererSectionCard } from "../RendererFrame";
import GlowyInput from "@/src/components/GlowyInput";

// ============================================================================
// Types
// ============================================================================

export interface ExerciseInputTextProps {
    prompt: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

// ============================================================================
// Constants
// ============================================================================

const ENCOURAGEMENTS: Array<{ min: number; message: string }> = [
    { min: 200, message: "Wonderful reflection!" },
    { min: 100, message: "Great detail — keep going!" },
    { min: 50, message: "Nice start — tell me more" },
    { min: 1, message: "Writing..." },
    { min: 0, message: "" },
];

// ============================================================================
// Component
// ============================================================================

export default function ExerciseInputText({
    prompt,
    placeholder,
    value,
    onChange,
}: ExerciseInputTextProps): React.JSX.Element {
    const charCount: number = value.length;

    const encouragement: string =
        ENCOURAGEMENTS.find((e) => charCount >= e.min)?.message ?? "";

    return (
        <View className="w-full">
            <RendererSectionCard eyebrow="Now: try it">
                <Text variant="h3" className="mb-4">
                    {prompt}
                </Text>

                <GlowyInput
                    message={value}
                    setMessage={onChange}
                    handleSendMessage={() => {}}
                    handleSubmitEditing={() => {}}
                    placeholder={placeholder ?? "Start writing here..."}
                />
            </RendererSectionCard>

            {/* Character count + encouragement */}
            <View className="flex-row items-center justify-between mt-2 px-1">
                <Text variant="label-bold" color="sage">
                    {encouragement}
                </Text>
                <Text variant="caption-muted">{charCount} chars</Text>
            </View>
        </View>
    );
}
