import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
} from "react-native";
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import ShortBottomModal from "@/src/components/ShortBottomModal";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Target02Icon,
  Calculator01Icon,
  Edit02Icon,
} from "@hugeicons/core-free-icons";

interface CalorieGoalModalProps {
  visible: boolean;
  currentGoal: number;
  onSave: (goal: number) => void;
  onClose: () => void;
}

type TabType = "manual" | "calculator";
type GenderType = "male" | "female";
type ActivityLevelType =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

interface ActivityLevel {
  key: ActivityLevelType;
  label: string;
  multiplier: number;
  description: string;
}

const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    key: "sedentary",
    label: "Sedentary",
    multiplier: 1.2,
    description: "Little or no exercise",
  },
  {
    key: "light",
    label: "Light",
    multiplier: 1.375,
    description: "Exercise 1-3 days/week",
  },
  {
    key: "moderate",
    label: "Moderate",
    multiplier: 1.55,
    description: "Exercise 3-5 days/week",
  },
  {
    key: "active",
    label: "Active",
    multiplier: 1.725,
    description: "Exercise 6-7 days/week",
  },
  {
    key: "very_active",
    label: "Very Active",
    multiplier: 1.9,
    description: "Hard exercise daily",
  },
];

const PRESET_GOALS: number[] = [1500, 1800, 2000, 2200, 2500, 3000];

/**
 * Calculates BMR using the Mifflin-St Jeor equation.
 * This is considered the most accurate formula for calculating BMR.
 */
const calculateBMR = (
  weightKg: number,
  heightCm: number,
  ageYears: number,
  gender: GenderType
): number => {
  // Mifflin-St Jeor Equation:
  // Male: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) + 5
  // Female: BMR = (10 × weight in kg) + (6.25 × height in cm) - (5 × age in years) - 161
  const baseBMR = 10 * weightKg + 6.25 * heightCm - 5 * ageYears;
  return gender === "male" ? baseBMR + 5 : baseBMR - 161;
};

/**
 * Calculates TDEE (Total Daily Energy Expenditure) from BMR and activity level.
 */
const calculateTDEE = (bmr: number, activityMultiplier: number): number => {
  return Math.round(bmr * activityMultiplier);
};

const CalorieGoalModal: React.FC<CalorieGoalModalProps> = ({
  visible,
  currentGoal,
  onSave,
  onClose,
}) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [activeTab, setActiveTab] = useState<TabType>("manual");
  const [inputValue, setInputValue] = useState<string>(currentGoal.toString());

  // Calculator state
  const [gender, setGender] = useState<GenderType>("male");
  const [age, setAge] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [activityLevel, setActivityLevel] =
    useState<ActivityLevelType>("moderate");
  const [calculatedCalories, setCalculatedCalories] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (visible) {
      setInputValue(currentGoal.toString());
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
    }
  }, [visible, currentGoal]);

  // Calculate calories when inputs change
  useEffect(() => {
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age, 10);

    if (weightNum > 0 && heightNum > 0 && ageNum > 0) {
      const bmr = calculateBMR(weightNum, heightNum, ageNum, gender);
      const activityMultiplier =
        ACTIVITY_LEVELS.find((a) => a.key === activityLevel)?.multiplier ||
        1.55;
      const tdee = calculateTDEE(bmr, activityMultiplier);
      setCalculatedCalories(tdee);
    } else {
      setCalculatedCalories(null);
    }
  }, [weight, height, age, gender, activityLevel]);

  const handleSave = (): void => {
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onSave(numValue);
      Keyboard.dismiss();
      onClose();
    }
  };

  const handleUseCalculated = (): void => {
    if (calculatedCalories) {
      setInputValue(calculatedCalories.toString());
      setActiveTab("manual");
    }
  };

  const handlePresetSelect = (preset: number): void => {
    setInputValue(preset.toString());
  };

  const renderManualTab = (): React.ReactNode => (
    <View className="flex-1">
      {/* Input Field */}
      <View className="mb-4">
        <Text className="text-gray-600 text-sm mb-2">
          Enter your daily calorie target
        </Text>
        <HStack className="items-center bg-gray-100 rounded-xl px-4 py-3">
          <BottomSheetTextInput
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="number-pad"
            placeholder="2000"
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-2xl font-bold text-gray-900"
            style={{ fontSize: 28, fontWeight: "bold" }}
            maxLength={5}
          />
          <Text className="text-gray-500 text-lg ml-2">kcal</Text>
        </HStack>
      </View>

      {/* Preset Options */}
      <View className="mb-5">
        <Text className="text-gray-500 text-sm mb-2">Quick select</Text>
        <HStack className="flex-wrap gap-2">
          {PRESET_GOALS.map((preset) => (
            <TouchableOpacity
              key={preset}
              onPress={() => handlePresetSelect(preset)}
              className={`px-4 py-2 rounded-full border ${
                inputValue === preset.toString()
                  ? "bg-orange-500 border-orange-500"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`font-medium ${
                  inputValue === preset.toString()
                    ? "text-white"
                    : "text-gray-700"
                }`}
              >
                {preset}
              </Text>
            </TouchableOpacity>
          ))}
        </HStack>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-orange-500 rounded-xl py-4 items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold text-lg">Save Goal</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCalculatorTab = (): React.ReactNode => (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Gender Selection */}
      <View className="mb-4">
        <Text className="text-gray-600 text-sm mb-2">Gender</Text>
        <HStack space="sm">
          <TouchableOpacity
            onPress={() => setGender("male")}
            className={`flex-1 py-3 rounded-xl items-center border ${
              gender === "male"
                ? "bg-orange-500 border-orange-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`font-medium ${
                gender === "male" ? "text-white" : "text-gray-700"
              }`}
            >
              Male
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setGender("female")}
            className={`flex-1 py-3 rounded-xl items-center border ${
              gender === "female"
                ? "bg-orange-500 border-orange-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`font-medium ${
                gender === "female" ? "text-white" : "text-gray-700"
              }`}
            >
              Female
            </Text>
          </TouchableOpacity>
        </HStack>
      </View>

      {/* Age, Weight, Height Inputs */}
      <HStack space="sm" className="mb-4">
        <View className="flex-1">
          <Text className="text-gray-600 text-sm mb-2">Age</Text>
          <HStack className="items-center bg-gray-100 rounded-xl px-3 py-2">
            <BottomSheetTextInput
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              placeholder="25"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-lg font-semibold text-gray-900"
              style={{ fontSize: 18, fontWeight: "600" }}
              maxLength={3}
            />
            <Text className="text-gray-400 text-sm">yrs</Text>
          </HStack>
        </View>

        <View className="flex-1">
          <Text className="text-gray-600 text-sm mb-2">Weight</Text>
          <HStack className="items-center bg-gray-100 rounded-xl px-3 py-2">
            <BottomSheetTextInput
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder="70"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-lg font-semibold text-gray-900"
              style={{ fontSize: 18, fontWeight: "600" }}
              maxLength={5}
            />
            <Text className="text-gray-400 text-sm">kg</Text>
          </HStack>
        </View>

        <View className="flex-1">
          <Text className="text-gray-600 text-sm mb-2">Height</Text>
          <HStack className="items-center bg-gray-100 rounded-xl px-3 py-2">
            <BottomSheetTextInput
              value={height}
              onChangeText={setHeight}
              keyboardType="number-pad"
              placeholder="170"
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-lg font-semibold text-gray-900"
              style={{ fontSize: 18, fontWeight: "600" }}
              maxLength={3}
            />
            <Text className="text-gray-400 text-sm">cm</Text>
          </HStack>
        </View>
      </HStack>

      {/* Activity Level */}
      <View className="mb-4">
        <Text className="text-gray-600 text-sm mb-2">Activity Level</Text>
        <VStack space="xs">
          {ACTIVITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.key}
              onPress={() => setActivityLevel(level.key)}
              className={`p-3 rounded-xl border ${
                activityLevel === level.key
                  ? "bg-orange-50 border-orange-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <HStack className="justify-between items-center">
                <VStack>
                  <Text
                    className={`font-medium ${
                      activityLevel === level.key
                        ? "text-orange-700"
                        : "text-gray-900"
                    }`}
                  >
                    {level.label}
                  </Text>
                  <Text
                    className={`text-xs ${
                      activityLevel === level.key
                        ? "text-orange-500"
                        : "text-gray-500"
                    }`}
                  >
                    {level.description}
                  </Text>
                </VStack>
                {activityLevel === level.key && (
                  <View className="w-5 h-5 rounded-full bg-orange-500 items-center justify-center">
                    <Text className="text-white text-xs">✓</Text>
                  </View>
                )}
              </HStack>
            </TouchableOpacity>
          ))}
        </VStack>
      </View>

      {/* Calculated Result */}
      {calculatedCalories ? (
        <View className="bg-green-50 rounded-xl p-4 mb-4 border border-green-200">
          <Text className="text-green-700 text-sm mb-1">
            Your estimated daily calories
          </Text>
          <HStack className="items-end" space="xs">
            <Text className="text-4xl font-bold text-green-700">
              {calculatedCalories}
            </Text>
            <Text className="text-green-600 pb-1">kcal/day</Text>
          </HStack>
          <Text className="text-green-600 text-xs mt-2">
            Based on Mifflin-St Jeor equation (most accurate for TDEE)
          </Text>
        </View>
      ) : (
        <View className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
          <Text className="text-gray-500 text-center">
            Fill in all fields to calculate your daily calories
          </Text>
        </View>
      )}

      {/* Use Calculated Button */}
      <TouchableOpacity
        onPress={handleUseCalculated}
        disabled={!calculatedCalories}
        className={`rounded-xl py-4 items-center ${
          calculatedCalories ? "bg-orange-500" : "bg-gray-300"
        }`}
        activeOpacity={0.8}
      >
        <Text
          className={`font-semibold text-lg ${
            calculatedCalories ? "text-white" : "text-gray-500"
          }`}
        >
          Use This Goal
        </Text>
      </TouchableOpacity>
    </BottomSheetScrollView>
  );

  return (
    <ShortBottomModal
      ref={modalRef}
      snapPoints={activeTab === "calculator" ? ["80%"] : ["50%"]}
      marginHorizontal={8}
      onDismiss={onClose}
      enableContentPanningGesture={activeTab === "calculator"}
    >
      <View className="px-5 pt-4 pb-6 flex-1">
        {/* Header */}
        <HStack className="items-center mb-4" space="sm">
          <View className="p-2 rounded-xl bg-orange-100">
            <HugeiconsIcon icon={Target02Icon} size={24} color="#F97316" />
          </View>
          <Text
            style={{
              fontSize: 22,
              fontFamily: APP_FONT_FAMILIES.semiBold,
              color: "#1f2937",
            }}
          >
            Daily Calorie Goal
          </Text>
        </HStack>

        {/* Tab Switcher */}
        <HStack className="bg-gray-100 rounded-xl p-1 mb-4">
          <TouchableOpacity
            onPress={() => setActiveTab("manual")}
            className={`flex-1 flex-row items-center justify-center py-2 rounded-lg gap-2 ${
              activeTab === "manual" ? "bg-white shadow-sm" : ""
            }`}
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              size={18}
              color={activeTab === "manual" ? "#F97316" : "#9CA3AF"}
            />
            <Text
              className={`font-medium ${
                activeTab === "manual" ? "text-orange-600" : "text-gray-500"
              }`}
            >
              Manual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("calculator")}
            className={`flex-1 flex-row items-center justify-center py-2 rounded-lg gap-2 ${
              activeTab === "calculator" ? "bg-white shadow-sm" : ""
            }`}
          >
            <HugeiconsIcon
              icon={Calculator01Icon}
              size={18}
              color={activeTab === "calculator" ? "#F97316" : "#9CA3AF"}
            />
            <Text
              className={`font-medium ${
                activeTab === "calculator" ? "text-orange-600" : "text-gray-500"
              }`}
            >
              Calculate
            </Text>
          </TouchableOpacity>
        </HStack>

        {/* Tab Content */}
        {activeTab === "manual" ? renderManualTab() : renderCalculatorTab()}
      </View>
    </ShortBottomModal>
  );
};

export default CalorieGoalModal;
