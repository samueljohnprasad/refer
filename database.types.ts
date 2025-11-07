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
      ai_weekly_summaries: {
        Row: {
          generated_at: string | null
          growth_insights: Json | null
          id: string
          recommendations: Json | null
          updated_at: string | null
          user_id: string
          week_end: string
          week_number: number
          week_start: string
          weekly_summary: Json | null
          year: number
        }
        Insert: {
          generated_at?: string | null
          growth_insights?: Json | null
          id?: string
          recommendations?: Json | null
          updated_at?: string | null
          user_id: string
          week_end: string
          week_number: number
          week_start: string
          weekly_summary?: Json | null
          year: number
        }
        Update: {
          generated_at?: string | null
          growth_insights?: Json | null
          id?: string
          recommendations?: Json | null
          updated_at?: string | null
          user_id?: string
          week_end?: string
          week_number?: number
          week_start?: string
          weekly_summary?: Json | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_weekly_summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      journal_ai_insights: {
        Row: {
          achievements: string[] | null
          aiInsights: string | null
          created_at: string
          energyLevel: number | null
          feelings: Json | null
          id: number
          journal_entry_id: number
          sleepQuality: number | null
          stressLevel: number | null
          triggers: string[] | null
          worries: string[] | null
        }
        Insert: {
          achievements?: string[] | null
          aiInsights?: string | null
          created_at?: string
          energyLevel?: number | null
          feelings?: Json | null
          id?: number
          journal_entry_id: number
          sleepQuality?: number | null
          stressLevel?: number | null
          triggers?: string[] | null
          worries?: string[] | null
        }
        Update: {
          achievements?: string[] | null
          aiInsights?: string | null
          created_at?: string
          energyLevel?: number | null
          feelings?: Json | null
          id?: number
          journal_entry_id?: number
          sleepQuality?: number | null
          stressLevel?: number | null
          triggers?: string[] | null
          worries?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_ai_insights_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_records"
            referencedColumns: ["id"]
          },
        ]
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
      journal_records: {
        Row: {
          created_at: string
          duration_seconds: number | null
          id: number
          input_type: string | null
          selected_date: string | null
          title: string | null
          transcripts: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          duration_seconds?: number | null
          id?: number
          input_type?: string | null
          selected_date?: string | null
          title?: string | null
          transcripts?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          duration_seconds?: number | null
          id?: number
          input_type?: string | null
          selected_date?: string | null
          title?: string | null
          transcripts?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      moods: {
        Row: {
          created_at: string
          id: number
          input_method: string | null
          journal_entry_id: number | null
          main_mood: Database["public"]["Enums"]["mood"] | null
          selected_date: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          input_method?: string | null
          journal_entry_id?: number | null
          main_mood?: Database["public"]["Enums"]["mood"] | null
          selected_date?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          input_method?: string | null
          journal_entry_id?: number | null
          main_mood?: Database["public"]["Enums"]["mood"] | null
          selected_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moods_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "moods_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          data: Json
          id: number
        }
        Insert: {
          data: Json
          id?: number
        }
        Update: {
          data?: Json
          id?: number
        }
        Relationships: []
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
      [_ in never]: never
    }
    Enums: {
      age_range_enum: "18_24" | "25_34" | "35_44" | "45_54" | "55_64" | "65+"
      app_permission: "channels.delete" | "messages.delete"
      app_role: "admin" | "moderator"
      gender_enum: "male" | "female" | "other"
      mood: "terrible" | "bad" | "okay" | "good" | "great"
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
      mood: ["terrible", "bad", "okay", "good", "great"],
      subscription_plan_enum: ["free", "trial", "weekly", "monthly", "yearly"],
      user_status: ["ONLINE", "OFFLINE"],
    },
  },
} as const
