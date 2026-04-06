/**
 * ExerciseInputText
 * Multi-line text input for exercise steps.
 * Features: character encouragement, placeholder, keyboard-aware.
 */

import React, { useCallback, useState } from "react";
import { View, Text, TextInput, Platform } from "react-native";

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
        <View className="flex-1">
            {/* Prompt */}
            <Text className="text-lg font-semibold text-slate-800 mb-4 leading-7">
                {prompt}
            </Text>

            {/* Text input */}
            <View className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder ?? "Start writing here..."}
                    placeholderTextColor="#94A3B8"
                    multiline
                    textAlignVertical="top"
                    className="flex-1 text-base text-slate-700 leading-6"
                    style={{ minHeight: 160 }}
                    accessibilityLabel={prompt}
                    accessibilityHint="Type your response"
                />
            </View>

            {/* Character count + encouragement */}
            <View className="flex-row items-center justify-between mt-2 px-1">
                <Text className="text-xs text-purple-500 font-medium">
                    {encouragement}
                </Text>
                <Text className="text-xs text-slate-400">{charCount} chars</Text>
            </View>
        </View>
    );
}
