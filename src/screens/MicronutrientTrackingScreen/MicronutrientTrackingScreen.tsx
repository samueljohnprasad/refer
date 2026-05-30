import React from "react";
import { View, ScrollView } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  CheckmarkCircle02Icon,
  Idea01Icon,
  WellnessIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { useHeaderHeight } from "expo-router/react-navigation";
import {
  getMicronutrientsByCategory,
  type MicronutrientConfig,
} from "@/src/config/micronutrients";
import { useMicronutrientTracking } from "./hooks/useMicronutrientTracking";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import { SectionHeader } from "@/src/components/ui/SectionHeader";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { SAGE, OTTER_BLUE } from "@/lib/tokens";

// ─── Presentational Layer ───────────────────────────────────────────────────

interface MicronutrientTrackingViewProps {
  trackedNutrients: Set<string>;
  toggleNutrient: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  headerHeight: number;
}

const MicronutrientTrackingView: React.FC<MicronutrientTrackingViewProps> = ({
  trackedNutrients,
  toggleNutrient,
  selectAll,
  deselectAll,
  headerHeight,
}) => {
  const vitamins: MicronutrientConfig[] = getMicronutrientsByCategory("vitamin");
  const minerals: MicronutrientConfig[] = getMicronutrientsByCategory("mineral");

  const trackedVitaminsCount: number = vitamins.filter((v: MicronutrientConfig) =>
    trackedNutrients.has(v.id)
  ).length;

  const trackedMineralsCount: number = minerals.filter((m: MicronutrientConfig) =>
    trackedNutrients.has(m.id)
  ).length;

  const renderNutrientItem = (
    nutrient: MicronutrientConfig,
    index: number
  ): React.ReactNode => {
    const isTracked: boolean = trackedNutrients.has(nutrient.id);

    return (
      <FadeInItem key={nutrient.id} index={index}>
        <Card
          variant={isTracked ? "answer-selected" : "answer"}
          radius="xl"
          showDepth={true}
          onPress={() => toggleNutrient(nutrient.id)}
          className="mb-3"
          contentClassName="flex-row items-center justify-between p-4"
        >
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-1">
              <Text
                variant="body-bold"
                color={isTracked ? "ink" : "soft"}
              >
                {nutrient.name}
              </Text>
              <View className="ml-2 px-2.5 py-0.5 rounded-full happy-brand-status-chip">
                <Text
                  variant="chip"
                  className={
                    nutrient.category === "vitamin"
                      ? "text-sage-600"
                      : "text-amber-600"
                  }
                >
                  {nutrient.category}
                </Text>
              </View>
            </View>
            <Text
              variant="body"
              color="soft"
              className="text-[15px] leading-5 mb-1"
            >
              {nutrient.description}
            </Text>
            <Text variant="caption-muted">
              Daily Target: {nutrient.dailyValue} {nutrient.unit}
            </Text>
          </View>

          <View className="ml-2">
            {isTracked ? (
              <View className="w-8 h-8 rounded-full items-center justify-center bg-sage-500 border border-sage-600">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  size={20}
                  color="#FFFFFF"
                />
              </View>
            ) : (
              <View className="w-8 h-8 rounded-full border-2 border-brand-border bg-brand-surface" />
            )}
          </View>
        </Card>
      </FadeInItem>
    );
  };

  return (
    <View className="flex-1 happy-brand-screen">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingTop: headerHeight + 16,
          paddingHorizontal: 16,
          paddingBottom: 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Actions - Stagger 0 */}
        <FadeInItem index={0}>
          <View className="flex-row gap-3 mb-10">
            <Button
              label="Select All"
              variant="primary"
              size="lg"
              onPress={selectAll}
              className="flex-1"
            />
            <Button
              label="Clear All"
              variant="secondary"
              size="lg"
              onPress={deselectAll}
              className="flex-1"
            />
          </View>
        </FadeInItem>

        {/* How it works Info Card - Stagger 1 */}
        <FadeInItem index={1}>
          <Card
            variant="tile"
            radius="xl"
            showDepth={true}
            className="mb-12"
            contentClassName="p-5"
          >
            <View className="flex-row items-center mb-1.5">
              <View className="w-8 h-8 rounded-full bg-sage-50 items-center justify-center mr-2">
                <HugeiconsIcon icon={Idea01Icon} size={18} color="#44633F" />
              </View>
              <Text variant="body-bold" color="sage">
                How it works
              </Text>
            </View>
            <Text variant="body" color="soft" className="text-[15px] leading-6">
              Select nutrients to track. AI will analyze your meals and show how
              much of each you're consuming in your daily summary.
            </Text>
          </Card>
        </FadeInItem>

        {/* Vitamins Section - Stagger 2 for header, then vitamins */}
        <View className="mb-12">
          <FadeInItem index={2}>
            <SectionHeader
              title="Vitamins"
              icon={WellnessIcon}
              count={`${trackedVitaminsCount} / ${vitamins.length}`}
              iconBgClass="bg-sage-50"
              iconColor={SAGE[500]}
              className="mb-4"
            />
          </FadeInItem>
          {vitamins.map((nutrient: MicronutrientConfig, idx: number) =>
            renderNutrientItem(nutrient, 3 + idx)
          )}
        </View>

        {/* Minerals Section - Staggered index follows vitamins list */}
        <View className="mb-12 pt-8 border-t border-brand-border/40">
          <FadeInItem index={3 + vitamins.length}>
            <SectionHeader
              title="Minerals"
              icon={SparklesIcon}
              count={`${trackedMineralsCount} / ${minerals.length}`}
              iconBgClass="bg-otter-blue/10"
              iconColor={OTTER_BLUE}
              className="mb-4"
            />
          </FadeInItem>
          {minerals.map((nutrient: MicronutrientConfig, idx: number) =>
            renderNutrientItem(nutrient, 4 + vitamins.length + idx)
          )}
        </View>
      </ScrollView>
    </View>
  );
};

// ─── Container Layer ─────────────────────────────────────────────────────────

const MicronutrientTrackingScreen: React.FC = () => {
  const headerHeight: number = useHeaderHeight();
  const {
    trackedNutrients,
    toggleNutrient,
    selectAll,
    deselectAll,
  } = useMicronutrientTracking();

  return (
    <MicronutrientTrackingView
      trackedNutrients={trackedNutrients}
      toggleNutrient={toggleNutrient}
      selectAll={selectAll}
      deselectAll={deselectAll}
      headerHeight={headerHeight}
    />
  );
};

export default MicronutrientTrackingScreen;
