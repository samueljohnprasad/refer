import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useDeepDive } from "@/src/hooks/insights/useDeepDive";
import { DeepDiveLayout } from "./components/DeepDiveLayout";
import { Section } from "./components/Section";
import { StatPill } from "./components/StatPill";
import type { DeepDiveConfig } from "@/src/hooks/insights/config/types";
import type { TimeRange } from "@/src/constants/insights";

interface DeepDiveScreenProps {
  config: DeepDiveConfig;
}

export default function DeepDiveScreen({ config }: DeepDiveScreenProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const { data, isLoading } = useDeepDive(config, timeRange);

  return (
    <DeepDiveLayout
      title={config.title}
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      isLoading={isLoading || !data}
    >
      {data && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-5 mt-2 flex-row gap-3 flex-wrap">
            {config.statPills.map((pill) => {
              const value = pill.getValue(data);
              if (value === null) return null;
              return (
                <StatPill key={pill.label} label={pill.label} value={value} />
              );
            })}
          </View>

          {config.sections.map((section) => {
            const content = section.render(data);
            if (!content) return null;
            return (
              <Section key={section.key} title={section.title}>
                {content}
              </Section>
            );
          })}
        </ScrollView>
      )}
    </DeepDiveLayout>
  );
}
