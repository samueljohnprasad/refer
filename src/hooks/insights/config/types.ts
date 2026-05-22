import type React from "react";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import type { ExerciseStatsEntry } from "../useExerciseStats";

export interface PrePostFieldMapping {
  exerciseType: ExerciseType;
  preField: string;
  postField: string;
  direction: "pre_minus_post" | "post_minus_pre";
}

export interface PrePostSession {
  date: string;
  pre: number;
  post: number;
  shift: number;
  exerciseType: ExerciseType;
}

export interface DeepDiveComputedData {
  entries: ExerciseStatsEntry[];
  totalSessions: number;
  sessions: PrePostSession[];
  avgShift: number | null;
  sessionsPerWeek: { week: string; count: number }[];
  custom: Record<string, any>;
}

export interface StatPillDef {
  label: string;
  getValue: (data: DeepDiveComputedData) => string | null;
}

export interface SectionDef {
  key: string;
  title: string;
  render: (data: DeepDiveComputedData) => React.ReactNode | null;
}

export interface DeepDiveConfig {
  category: ExerciseCategory;
  title: string;
  color: string;
  exerciseTypes?: ExerciseType[];
  fieldMappings: PrePostFieldMapping[];
  statPills: StatPillDef[];
  sections: SectionDef[];
  customAggregator?: (entries: ExerciseStatsEntry[]) => Record<string, any>;
}
