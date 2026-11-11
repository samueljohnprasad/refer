// ponytail: typed interfaces for onboarding domain models
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
  isHeading?: boolean;
  isQuote?: boolean;
  isFair?: boolean;
  why?: string;
  trapLabel?: string;
  timestamp: number;
}

export interface ReflectionData {
  goal: GoalId | null;
  source: 'example' | 'personal';
  art?: GoalId;
  situation: string;
  thought: string;
  trap?: TrapType;
  why: string;
  fair: string;
  before: number | null;
  after: number | null;
  reminder: ReminderPreset | string | null;
  at?: number;
}
