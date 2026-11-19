// ponytail: typed interfaces for onboarding domain models
import type { TrapChoice } from '@/src/domains/exercises/domain/trap';
import { GoalId, TrapType, MessageSender, ReminderPreset } from './enums';

export interface GoalDefinition {
  id: GoalId;
  label: string;
  sub: string;
  tint: string;
  f: number;
  mirror: string;
  scene: string;
  thought: string;
  trap: TrapType;
  why: string;
  fair: string;
  ideas: {
    sit: string[];
    th: string[];
  };
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  /** plain lead-in line shown above a quote/fair dot row, e.g. "Then this thought shows up:" */
  leadText?: string;
  isHeading?: boolean;
  isQuote?: boolean;
  isFair?: boolean;
  why?: string;
  trapLabel?: string;
  timestamp: number;
}

export interface ReflectionData {
  id?: string;
  goal: GoalId | null;
  source: 'example' | 'personal';
  art?: GoalId;
  situation: string;
  thought: string;
  trap?: TrapType | TrapChoice;
  why: string;
  fair: string;
  before: number | null;
  after: number | null;
  reminder: ReminderPreset | string | null;
  at?: number;
}
