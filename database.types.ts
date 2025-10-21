export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_color: string
          category: string
          created_at: string | null
          description: string
          icon: string
          id: number
          name: string
          requirement_type: string
          requirement_value: number
        }
        Insert: {
          badge_color: string
          category: string
          created_at?: string | null
          description: string
          icon: string
          id?: number
          name: string
          requirement_type: string
          requirement_value: number
        }
        Update: {
          badge_color?: string
          category?: string
          created_at?: string | null
          description?: string
          icon?: string
          id?: number
          name?: string
          requirement_type?: string
          requirement_value?: number
        }
        Relationships: []
      }
      daily_moods: {
        Row: {
          day: string
          mood_avg: number
          mood_count: number
          mood_sum: number
          user_id: string
        }
        Insert: {
          day?: string
          mood_avg?: number
          mood_count?: number
          mood_sum?: number
          user_id: string
        }
        Update: {
          day?: string
          mood_avg?: number
          mood_count?: number
          mood_sum?: number
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          aiInsights: string | null
          created_at: string
          duration_seconds: number | null
          enrichedTranscript: string | null
          feelings: Json | null
          id: number
          language_code: string | null
          mainEmoji: string | null
          moodScore: number | null
          positiveInsights: string[] | null
          selected_date: string | null
          suggestedTags: string[] | null
          summary: string | null
          title: string | null
          user_id: string
        }
        Insert: {
          aiInsights?: string | null
          created_at?: string
          duration_seconds?: number | null
          enrichedTranscript?: string | null
          feelings?: Json | null
          id?: number
          language_code?: string | null
          mainEmoji?: string | null
          moodScore?: number | null
          positiveInsights?: string[] | null
          selected_date?: string | null
          suggestedTags?: string[] | null
          summary?: string | null
          title?: string | null
          user_id?: string
        }
        Update: {
          aiInsights?: string | null
          created_at?: string
          duration_seconds?: number | null
          enrichedTranscript?: string | null
          feelings?: Json | null
          id?: number
          language_code?: string | null
          mainEmoji?: string | null
          moodScore?: number | null
          positiveInsights?: string[] | null
          selected_date?: string | null
          suggestedTags?: string[] | null
          summary?: string | null
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: Database["public"]["Enums"]["age_range_enum"] | null
          avatar_url: string | null
          created_at: string | null
          current_streak: number | null
          display_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          last_journal_date: string | null
          longest_streak: number | null
          onboarding_completed: boolean | null
          reasons: string[] | null
          streak_freeze_count: number | null
          subscription_plan: string | null
          trial_ends_at: string | null
        }
        Insert: {
          age_range?: Database["public"]["Enums"]["age_range_enum"] | null
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id?: string
          last_journal_date?: string | null
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          reasons?: string[] | null
          streak_freeze_count?: number | null
          subscription_plan?: string | null
          trial_ends_at?: string | null
        }
        Update: {
          age_range?: Database["public"]["Enums"]["age_range_enum"] | null
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          display_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id?: string
          last_journal_date?: string | null
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          reasons?: string[] | null
          streak_freeze_count?: number | null
          subscription_plan?: string | null
          trial_ends_at?: string | null
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string
          id: number
          text: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          text?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: number
          id: number
          is_claimed: boolean | null
          progress: number | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: number
          id?: number
          is_claimed?: boolean | null
          progress?: number | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: number
          id?: number
          is_claimed?: boolean | null
          progress?: number | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string
          daily_reminder_enabled: boolean | null
          remainders: Json | null
          timezone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_reminder_enabled?: boolean | null
          remainders?: Json | null
          timezone?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          daily_reminder_enabled?: boolean | null
          remainders?: Json | null
          timezone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_award_achievements: {
        Args: { p_user_id: string }
        Returns: {
          newly_unlocked_achievement_id: number
        }[]
      }
    }
    Enums: {
      age_range_enum: "18_24" | "25_34" | "35_44" | "45_54" | "55_64" | "65+"
      app_permission: "channels.delete" | "messages.delete"
      app_role: "admin" | "moderator"
      gender_enum: "male" | "female" | "other"
      subscription_plan_enum: "free" | "trial" | "weekly" | "monthly" | "yearly"
      user_status: "ONLINE" | "OFFLINE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      age_range_enum: ["18_24", "25_34", "35_44", "45_54", "55_64", "65+"],
      app_permission: ["channels.delete", "messages.delete"],
      app_role: ["admin", "moderator"],
      gender_enum: ["male", "female", "other"],
      subscription_plan_enum: ["free", "trial", "weekly", "monthly", "yearly"],
      user_status: ["ONLINE", "OFFLINE"],
    },
  },
} as const
