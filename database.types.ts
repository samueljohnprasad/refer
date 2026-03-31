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
      bandit_arm_stats: {
        Row: {
          alpha: number
          beta: number
          id: string
          last_updated: string | null
          template_id: string
          total_opened: number
          total_sent: number
          user_segment: string
        }
        Insert: {
          alpha?: number
          beta?: number
          id?: string
          last_updated?: string | null
          template_id: string
          total_opened?: number
          total_sent?: number
          user_segment: string
        }
        Update: {
          alpha?: number
          beta?: number
          id?: string
          last_updated?: string | null
          template_id?: string
          total_opened?: number
          total_sent?: number
          user_segment?: string
        }
        Relationships: [
          {
            foreignKeyName: "bandit_arm_stats_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      calorie_entries: {
        Row: {
          created_at: string
          foods: Json
          health_score: number | null
          health_score_reasoning: string | null
          id: string
          image_url: string | null
          meal_type: string
          selected_date: string
          suggestions: string[] | null
          total_calories: number
          total_carbs: number
          total_fat: number
          total_fiber: number
          total_micronutrients: Json | null
          total_protein: number
          user_id: string
        }
        Insert: {
          created_at?: string
          foods?: Json
          health_score?: number | null
          health_score_reasoning?: string | null
          id?: string
          image_url?: string | null
          meal_type: string
          selected_date?: string
          suggestions?: string[] | null
          total_calories?: number
          total_carbs?: number
          total_fat?: number
          total_fiber?: number
          total_micronutrients?: Json | null
          total_protein?: number
          user_id: string
        }
        Update: {
          created_at?: string
          foods?: Json
          health_score?: number | null
          health_score_reasoning?: string | null
          id?: string
          image_url?: string | null
          meal_type?: string
          selected_date?: string
          suggestions?: string[] | null
          total_calories?: number
          total_carbs?: number
          total_fat?: number
          total_fiber?: number
          total_micronutrients?: Json | null
          total_protein?: number
          user_id?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          balance_after: number
          created_at: string | null
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after: number
          created_at?: string | null
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          created_at?: string | null
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_user_id_fkey"
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
          day: string
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
      delete_users: {
        Row: {
          "Created at": string | null
          created_at: string
          "Display name": string | null
          Email: string | null
          id: number
          "Last sign in at": string | null
          Phone: string | null
          Providers: string | null
          UID: string | null
        }
        Insert: {
          "Created at"?: string | null
          created_at?: string
          "Display name"?: string | null
          Email?: string | null
          id?: number
          "Last sign in at"?: string | null
          Phone?: string | null
          Providers?: string | null
          UID?: string | null
        }
        Update: {
          "Created at"?: string | null
          created_at?: string
          "Display name"?: string | null
          Email?: string | null
          id?: number
          "Last sign in at"?: string | null
          Phone?: string | null
          Providers?: string | null
          UID?: string | null
        }
        Relationships: []
      }
      gratitude_entries: {
        Row: {
          completed: boolean
          created_at: string | null
          current_mood: string
          final_intensity: number
          gratitude_entries: Json
          id: string
          initial_intensity: number
          selected_date: string
          selected_prompt: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          current_mood: string
          final_intensity: number
          gratitude_entries?: Json
          id?: string
          initial_intensity: number
          selected_date?: string
          selected_prompt: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          current_mood?: string
          final_intensity?: number
          gratitude_entries?: Json
          id?: string
          initial_intensity?: number
          selected_date?: string
          selected_prompt?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      habit_completions: {
        Row: {
          completed_at: string | null
          completed_date: string
          habit_id: string
          id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_date: string
          habit_id: string
          id?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_date?: string
          habit_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "habit_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          end_repeat_count: number | null
          end_repeat_date: string | null
          end_repeat_option: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          repeat_days: number[] | null
          repeat_pattern: string | null
          scheduled_time: string | null
          sort_order: number | null
          start_date: string | null
          time_option: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_repeat_count?: number | null
          end_repeat_date?: string | null
          end_repeat_option?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          repeat_days?: number[] | null
          repeat_pattern?: string | null
          scheduled_time?: string | null
          sort_order?: number | null
          start_date?: string | null
          time_option?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          end_repeat_count?: number | null
          end_repeat_date?: string | null
          end_repeat_option?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          repeat_days?: number[] | null
          repeat_pattern?: string | null
          scheduled_time?: string | null
          sort_order?: number | null
          start_date?: string | null
          time_option?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_ai_insights: {
        Row: {
          achievements: string[] | null
          aiInsights: string | null
          copingStrategies: string[] | null
          created_at: string
          energyLevel: number | null
          feelings: Json | null
          goals: string[] | null
          id: number
          journal_entry_id: number
          "physical-symptoms": string[] | null
          sleepQuality: number | null
          stressLevel: number | null
          triggers: string[] | null
          worries: string[] | null
        }
        Insert: {
          achievements?: string[] | null
          aiInsights?: string | null
          copingStrategies?: string[] | null
          created_at?: string
          energyLevel?: number | null
          feelings?: Json | null
          goals?: string[] | null
          id?: number
          journal_entry_id: number
          "physical-symptoms"?: string[] | null
          sleepQuality?: number | null
          stressLevel?: number | null
          triggers?: string[] | null
          worries?: string[] | null
        }
        Update: {
          achievements?: string[] | null
          aiInsights?: string | null
          copingStrategies?: string[] | null
          created_at?: string
          energyLevel?: number | null
          feelings?: Json | null
          goals?: string[] | null
          id?: number
          journal_entry_id?: number
          "physical-symptoms"?: string[] | null
          sleepQuality?: number | null
          stressLevel?: number | null
          triggers?: string[] | null
          worries?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_ai_insights_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: true
            referencedRelation: "journal_records"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_records: {
        Row: {
          bookmarked_at: string | null
          duration_seconds: number | null
          id: number
          input_type: string | null
          is_bookmarked: boolean | null
          selected_date: string | null
          title: string | null
          transcripts: string | null
          user_id: string | null
          words_count: number | null
        }
        Insert: {
          bookmarked_at?: string | null
          duration_seconds?: number | null
          id?: number
          input_type?: string | null
          is_bookmarked?: boolean | null
          selected_date?: string | null
          title?: string | null
          transcripts?: string | null
          user_id?: string | null
          words_count?: number | null
        }
        Update: {
          bookmarked_at?: string | null
          duration_seconds?: number | null
          id?: number
          input_type?: string | null
          is_bookmarked?: boolean | null
          selected_date?: string | null
          title?: string | null
          transcripts?: string | null
          user_id?: string | null
          words_count?: number | null
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
          id: number
          input_method: string | null
          journal_entry_id: number | null
          main_mood: Database["public"]["Enums"]["mood"] | null
          mood_score: number | null
          selected_date: string | null
          user_id: string | null
        }
        Insert: {
          id?: number
          input_method?: string | null
          journal_entry_id?: number | null
          main_mood?: Database["public"]["Enums"]["mood"] | null
          mood_score?: number | null
          selected_date?: string | null
          user_id?: string | null
        }
        Update: {
          id?: number
          input_method?: string | null
          journal_entry_id?: number | null
          main_mood?: Database["public"]["Enums"]["mood"] | null
          mood_score?: number | null
          selected_date?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moods_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: true
            referencedRelation: "journal_records"
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
      notification_log: {
        Row: {
          body: string
          category: string
          converted_at: string | null
          delivery_status: string | null
          expo_ticket_id: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          sent_at: string | null
          template_id: string | null
          title: string
          user_id: string
          user_segment: string | null
        }
        Insert: {
          body: string
          category: string
          converted_at?: string | null
          delivery_status?: string | null
          expo_ticket_id?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          template_id?: string | null
          title: string
          user_id: string
          user_segment?: string | null
        }
        Update: {
          body?: string
          category?: string
          converted_at?: string | null
          delivery_status?: string | null
          expo_ticket_id?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          sent_at?: string | null
          template_id?: string | null
          title?: string
          user_id?: string
          user_segment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_log_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body_template: string
          category: string
          created_at: string | null
          id: string
          is_active: boolean
          min_segment: string | null
          title_template: string
          updated_at: string | null
        }
        Insert: {
          body_template: string
          category: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          min_segment?: string | null
          title_template: string
          updated_at?: string | null
        }
        Update: {
          body_template?: string
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean
          min_segment?: string | null
          title_template?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      onboarding_events: {
        Row: {
          action: string
          created_at: string | null
          id: string
          metadata: Json | null
          step_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          step_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          step_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age_range: Database["public"]["Enums"]["age_range_enum"] | null
          avatar_url: string | null
          created_at: string | null
          current_streak: number | null
          daily_calorie_goal: number | null
          display_name: string | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          id: string
          last_journal_date: string | null
          longest_streak: number | null
          onboarding_completed: boolean | null
          onboarding_goals: string[] | null
          onboarding_mood: string | null
          reasons: string[] | null
          streak_freeze_count: number | null
          subscription_plan: string | null
          trial_ends_at: string | null
          trial_offered_at: string | null
          trial_started_at: string | null
        }
        Insert: {
          age_range?: Database["public"]["Enums"]["age_range_enum"] | null
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          daily_calorie_goal?: number | null
          display_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id?: string
          last_journal_date?: string | null
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          onboarding_goals?: string[] | null
          onboarding_mood?: string | null
          reasons?: string[] | null
          streak_freeze_count?: number | null
          subscription_plan?: string | null
          trial_ends_at?: string | null
          trial_offered_at?: string | null
          trial_started_at?: string | null
        }
        Update: {
          age_range?: Database["public"]["Enums"]["age_range_enum"] | null
          avatar_url?: string | null
          created_at?: string | null
          current_streak?: number | null
          daily_calorie_goal?: number | null
          display_name?: string | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          id?: string
          last_journal_date?: string | null
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          onboarding_goals?: string[] | null
          onboarding_mood?: string | null
          reasons?: string[] | null
          streak_freeze_count?: number | null
          subscription_plan?: string | null
          trial_ends_at?: string | null
          trial_offered_at?: string | null
          trial_started_at?: string | null
        }
        Relationships: []
      }
      push_tokens: {
        Row: {
          created_at: string | null
          expo_push_token: string
          id: string
          is_valid: boolean
          platform: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expo_push_token: string
          id?: string
          is_valid?: boolean
          platform: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expo_push_token?: string
          id?: string
          is_valid?: boolean
          platform?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          created_at: string
          id: string
          is_support: boolean | null
          message: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_support?: boolean | null
          message: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_support?: boolean | null
          message?: string
          updated_at?: string
          user_id?: string
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
      thought_catcher_entries: {
        Row: {
          automatic_thought: string
          balanced_thought: string | null
          created_at: string
          id: string
          intensity: number
          is_true: string | null
          selected_date: string
          situation: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          automatic_thought: string
          balanced_thought?: string | null
          created_at?: string
          id?: string
          intensity: number
          is_true?: string | null
          selected_date: string
          situation: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          automatic_thought?: string
          balanced_thought?: string | null
          created_at?: string
          id?: string
          intensity?: number
          is_true?: string | null
          selected_date?: string
          situation?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      thought_reframing_entries: {
        Row: {
          automatic_thought: string
          balanced_thought: string | null
          cognitive_distortions: Json | null
          completed: boolean | null
          created_at: string
          emotions: Json | null
          evidence_against: Json | null
          evidence_for: Json | null
          id: string
          selected_date: string
          situation: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          automatic_thought: string
          balanced_thought?: string | null
          cognitive_distortions?: Json | null
          completed?: boolean | null
          created_at?: string
          emotions?: Json | null
          evidence_against?: Json | null
          evidence_for?: Json | null
          id?: string
          selected_date?: string
          situation: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          automatic_thought?: string
          balanced_thought?: string | null
          cognitive_distortions?: Json | null
          completed?: boolean | null
          created_at?: string
          emotions?: Json | null
          evidence_against?: Json | null
          evidence_for?: Json | null
          id?: string
          selected_date?: string
          situation?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          id: string
          unlocked_at: string | null
          user_id: string
          xp_awarded: number
        }
        Insert: {
          achievement_id: string
          id?: string
          unlocked_at?: string | null
          user_id: string
          xp_awarded?: number
        }
        Update: {
          achievement_id?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          challenge_type: string
          completed: boolean
          completed_at: string | null
          created_at: string | null
          id: string
          period_start: string
          progress: number
          target: number
          user_id: string
        }
        Insert: {
          challenge_id: string
          challenge_type: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          id?: string
          period_start: string
          progress?: number
          target: number
          user_id: string
        }
        Update: {
          challenge_id?: string
          challenge_type?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string | null
          id?: string
          period_start?: string
          progress?: number
          target?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_settings: {
        Row: {
          achievement_reminders: boolean | null
          created_at: string | null
          habit_reminders: boolean | null
          max_per_day: number | null
          mood_reminders: boolean | null
          push_enabled: boolean
          quiet_hours_end: number | null
          quiet_hours_start: number | null
          streak_reminders: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievement_reminders?: boolean | null
          created_at?: string | null
          habit_reminders?: boolean | null
          max_per_day?: number | null
          mood_reminders?: boolean | null
          push_enabled?: boolean
          quiet_hours_end?: number | null
          quiet_hours_start?: number | null
          streak_reminders?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievement_reminders?: boolean | null
          created_at?: string | null
          habit_reminders?: boolean | null
          max_per_day?: number | null
          mood_reminders?: boolean | null
          push_enabled?: boolean
          quiet_hours_end?: number | null
          quiet_hours_start?: number | null
          streak_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
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
      user_rewards: {
        Row: {
          id: string
          reward_id: string
          source: string | null
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          reward_id: string
          source?: string | null
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          reward_id?: string
          source?: string | null
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_send_times: {
        Row: {
          computed_at: string | null
          confidence: number | null
          data_points: number | null
          optimal_hour: number
          optimal_minute: number
          user_id: string
        }
        Insert: {
          computed_at?: string | null
          confidence?: number | null
          data_points?: number | null
          optimal_hour?: number
          optimal_minute?: number
          user_id: string
        }
        Update: {
          computed_at?: string | null
          confidence?: number | null
          data_points?: number | null
          optimal_hour?: number
          optimal_minute?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_send_times_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_wallet: {
        Row: {
          coins: number
          gems: number
          total_coins_earned: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coins?: number
          gems?: number
          total_coins_earned?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coins?: number
          gems?: number
          total_coins_earned?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_wallet_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_xp: {
        Row: {
          created_at: string | null
          id: string
          last_reset_date: string
          today_xp: number
          total_xp: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_reset_date?: string
          today_xp?: number
          total_xp?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_reset_date?: string
          today_xp?: number
          total_xp?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_xp_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      xp_history: {
        Row: {
          action: string
          amount: number
          created_at: string | null
          description: string | null
          id: string
          user_id: string
        }
        Insert: {
          action: string
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "xp_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
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
      cleanup_old_challenges: { Args: never; Returns: undefined }
    }
    Enums: {
      age_range_enum: "18_24" | "25_34" | "35_44" | "45_54" | "55_64" | "65+"
      app_permission: "channels.delete" | "messages.delete"
      app_role: "admin" | "moderator"
      gender_enum: "male" | "female" | "other"
      mood: "terrible" | "bad" | "fine" | "good" | "great"
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
      mood: ["terrible", "bad", "fine", "good", "great"],
      subscription_plan_enum: ["free", "trial", "weekly", "monthly", "yearly"],
      user_status: ["ONLINE", "OFFLINE"],
    },
  },
} as const
