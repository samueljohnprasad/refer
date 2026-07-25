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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
      coping_cards: {
        Row: {
          archived: boolean
          created_at: string
          exercise_entry_id: string | null
          exercise_type: string
          id: string
          original_thought: string | null
          reframe_label: string
          reframe_text: string
          starred: boolean
          user_id: string
        }
        Insert: {
          archived?: boolean
          created_at?: string
          exercise_entry_id?: string | null
          exercise_type: string
          id?: string
          original_thought?: string | null
          reframe_label?: string
          reframe_text: string
          starred?: boolean
          user_id: string
        }
        Update: {
          archived?: boolean
          created_at?: string
          exercise_entry_id?: string | null
          exercise_type?: string
          id?: string
          original_thought?: string | null
          reframe_label?: string
          reframe_text?: string
          starred?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coping_cards_exercise_entry_id_fkey"
            columns: ["exercise_entry_id"]
            isOneToOne: false
            referencedRelation: "exercise_entries"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          color_hex: string
          created_at: string
          description: string | null
          icon_url: string | null
          id: string
          is_published: boolean
          order_index: number
          title: string
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title: string
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string | null
          icon_url?: string | null
          id?: string
          is_published?: boolean
          order_index?: number
          title?: string
        }
        Relationships: []
      }
      daily_ai: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          input_tokens: number | null
          output_tokens: number | null
          personalized_reflection: Json | null
          reflection_date: string
          structured_memory: Json | null
          summary: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          personalized_reflection?: Json | null
          reflection_date: string
          structured_memory?: Json | null
          summary: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          personalized_reflection?: Json | null
          reflection_date?: string
          structured_memory?: Json | null
          summary?: string
          user_id?: string
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
      exercise_contents: {
        Row: {
          created_at: string
          id: string
          instruction: string
          node_id: string
          steps: Json
        }
        Insert: {
          created_at?: string
          id?: string
          instruction: string
          node_id: string
          steps?: Json
        }
        Update: {
          created_at?: string
          id?: string
          instruction?: string
          node_id?: string
          steps?: Json
        }
        Relationships: [
          {
            foreignKeyName: "exercise_contents_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      exercise_entries: {
        Row: {
          completed_at: string | null
          completed_steps: Json
          created_at: string
          current_step: string
          exercise_type: string
          id: string
          response: Json
          schema_version: number
          selected_date: string
          status: string
          step_index: number
          step_timings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_steps?: Json
          created_at?: string
          current_step: string
          exercise_type: string
          id?: string
          response?: Json
          schema_version?: number
          selected_date?: string
          status?: string
          step_index?: number
          step_timings?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_steps?: Json
          created_at?: string
          current_step?: string
          exercise_type?: string
          id?: string
          response?: Json
          schema_version?: number
          selected_date?: string
          status?: string
          step_index?: number
          step_timings?: Json
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
      insight_points_ledger: {
        Row: {
          amount: number
          earned_at: string | null
          id: string
          journey_id: string | null
          metadata: Json | null
          source: string
          source_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          earned_at?: string | null
          id?: string
          journey_id?: string | null
          metadata?: Json | null
          source: string
          source_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          earned_at?: string | null
          id?: string
          journey_id?: string | null
          metadata?: Json | null
          source?: string
          source_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "insight_points_ledger_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insight_points_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_ai: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          input_tokens: number | null
          journal_id: number
          output_tokens: number | null
          structured_memory: Json | null
          summary: string
          user_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          journal_id: number
          output_tokens?: number | null
          structured_memory?: Json | null
          summary: string
          user_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          journal_id?: number
          output_tokens?: number | null
          structured_memory?: Json | null
          summary?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_journal_ai_journal_records"
            columns: ["journal_id"]
            isOneToOne: false
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
      journey_template_nodes: {
        Row: {
          content: Json
          created_at: string | null
          description: string | null
          estimated_minutes: number
          icon_key: string | null
          id: string
          metadata: Json | null
          node_index: number
          node_type: string
          rewards: Json
          task_id: string
          title: string | null
          unit_id: string
          variant_key: string
          xp_reward: number
        }
        Insert: {
          content?: Json
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number
          icon_key?: string | null
          id?: string
          metadata?: Json | null
          node_index: number
          node_type: string
          rewards?: Json
          task_id?: string
          title?: string | null
          unit_id: string
          variant_key?: string
          xp_reward?: number
        }
        Update: {
          content?: Json
          created_at?: string | null
          description?: string | null
          estimated_minutes?: number
          icon_key?: string | null
          id?: string
          metadata?: Json | null
          node_index?: number
          node_type?: string
          rewards?: Json
          task_id?: string
          title?: string | null
          unit_id?: string
          variant_key?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_nodes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "journey_template_units"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_sections: {
        Row: {
          color_scheme: string
          created_at: string | null
          description: string
          id: string
          journey_id: string
          mascot_placements: Json
          section_number: number
          title: string
          unlock_rule: string
        }
        Insert: {
          color_scheme?: string
          created_at?: string | null
          description?: string
          id?: string
          journey_id: string
          mascot_placements?: Json
          section_number: number
          title: string
          unlock_rule?: string
        }
        Update: {
          color_scheme?: string
          created_at?: string | null
          description?: string
          id?: string
          journey_id?: string
          mascot_placements?: Json
          section_number?: number
          title?: string
          unlock_rule?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_sections_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_template_units: {
        Row: {
          color_scheme: string
          created_at: string | null
          description: string
          id: string
          journey_id: string
          mascot_placements: Json
          section_id: string | null
          section_unit_number: number | null
          title: string
          unit_number: number
          unlock_rule: string
        }
        Insert: {
          color_scheme?: string
          created_at?: string | null
          description?: string
          id?: string
          journey_id: string
          mascot_placements?: Json
          section_id?: string | null
          section_unit_number?: number | null
          title: string
          unit_number: number
          unlock_rule?: string
        }
        Update: {
          color_scheme?: string
          created_at?: string | null
          description?: string
          id?: string
          journey_id?: string
          mascot_placements?: Json
          section_id?: string | null
          section_unit_number?: number | null
          title?: string
          unit_number?: number
          unlock_rule?: string
        }
        Relationships: [
          {
            foreignKeyName: "journey_template_units_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journey_template_units_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "journey_template_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_templates: {
        Row: {
          category: string
          color_scheme: string
          color_theme_key: string | null
          created_at: string | null
          description: string
          difficulty: string
          estimated_days: number | null
          icon_key: string | null
          icon_url: string | null
          id: string
          is_active: boolean
          slug: string
          sort_order: number
          title: string
          total_nodes: number
          updated_at: string | null
          version: number
        }
        Insert: {
          category?: string
          color_scheme?: string
          color_theme_key?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string
          estimated_days?: number | null
          icon_key?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          slug: string
          sort_order?: number
          title: string
          total_nodes?: number
          updated_at?: string | null
          version?: number
        }
        Update: {
          category?: string
          color_scheme?: string
          color_theme_key?: string | null
          created_at?: string | null
          description?: string
          difficulty?: string
          estimated_days?: number | null
          icon_key?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean
          slug?: string
          sort_order?: number
          title?: string
          total_nodes?: number
          updated_at?: string | null
          version?: number
        }
        Relationships: []
      }
      lesson_contents: {
        Row: {
          created_at: string
          id: string
          node_id: string
          screens: Json
        }
        Insert: {
          created_at?: string
          id?: string
          node_id: string
          screens?: Json
        }
        Update: {
          created_at?: string
          id?: string
          node_id?: string
          screens?: Json
        }
        Relationships: [
          {
            foreignKeyName: "lesson_contents_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_ai: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          input_tokens: number | null
          month: number
          output_tokens: number | null
          personalized_reflection: Json | null
          structured_memory: Json | null
          summary: string
          user_id: string
          year: number
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          month: number
          output_tokens?: number | null
          personalized_reflection?: Json | null
          structured_memory?: Json | null
          summary: string
          user_id: string
          year: number
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          month?: number
          output_tokens?: number | null
          personalized_reflection?: Json | null
          structured_memory?: Json | null
          summary?: string
          user_id?: string
          year?: number
        }
        Relationships: []
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
      node_attempts: {
        Row: {
          attempt_number: number
          id: string
          node_id: string
          score: number | null
          started_at: string
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          attempt_number: number
          id?: string
          node_id: string
          score?: number | null
          started_at?: string
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          attempt_number?: number
          id?: string
          node_id?: string
          score?: number | null
          started_at?: string
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "node_attempts_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      nodes: {
        Row: {
          content_id: string | null
          content_type: string | null
          estimated_mins: number
          id: string
          order_index: number
          pass_threshold: number | null
          title: string
          type: string
          unit_id: string
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          estimated_mins?: number
          id?: string
          order_index?: number
          pass_threshold?: number | null
          title: string
          type: string
          unit_id: string
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          estimated_mins?: number
          id?: string
          order_index?: number
          pass_threshold?: number | null
          title?: string
          type?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nodes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
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
      practice_contents: {
        Row: {
          created_at: string
          id: string
          instruction: string
          node_id: string
          repeat_count: number
          steps: Json
        }
        Insert: {
          created_at?: string
          id?: string
          instruction: string
          node_id: string
          repeat_count?: number
          steps?: Json
        }
        Update: {
          created_at?: string
          id?: string
          instruction?: string
          node_id?: string
          repeat_count?: number
          steps?: Json
        }
        Relationships: [
          {
            foreignKeyName: "practice_contents_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
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
      sections: {
        Row: {
          course_id: string
          id: string
          order_index: number
          title: string
        }
        Insert: {
          course_id: string
          id?: string
          order_index?: number
          title: string
        }
        Update: {
          course_id?: string
          id?: string
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      story_contents: {
        Row: {
          created_at: string
          dialogues: Json
          id: string
          node_id: string
        }
        Insert: {
          created_at?: string
          dialogues?: Json
          id?: string
          node_id: string
        }
        Update: {
          created_at?: string
          dialogues?: Json
          id?: string
          node_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_contents_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
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
      units: {
        Row: {
          icon_key: string
          id: string
          order_index: number
          section_id: string
          title: string
        }
        Insert: {
          icon_key?: string
          id?: string
          order_index?: number
          section_id: string
          title: string
        }
        Update: {
          icon_key?: string
          id?: string
          order_index?: number
          section_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
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
      user_course_node_progress: {
        Row: {
          attempts: number
          best_score: number | null
          completed_at: string | null
          last_attempted_at: string | null
          last_score: number | null
          node_id: string
          status: string
          user_id: string
        }
        Insert: {
          attempts?: number
          best_score?: number | null
          completed_at?: string | null
          last_attempted_at?: string | null
          last_score?: number | null
          node_id: string
          status: string
          user_id: string
        }
        Update: {
          attempts?: number
          best_score?: number | null
          completed_at?: string | null
          last_attempted_at?: string | null
          last_score?: number | null
          node_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_node_progress_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_course_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_journey_enrollments: {
        Row: {
          completed_at: string | null
          current_section_id: string | null
          current_section_number: number | null
          current_section_unit_number: number | null
          current_unit_id: string | null
          current_unit_number: number
          enrolled_at: string | null
          id: string
          journey_id: string
          status: string
          template_version: number
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          current_section_id?: string | null
          current_section_number?: number | null
          current_section_unit_number?: number | null
          current_unit_id?: string | null
          current_unit_number?: number
          enrolled_at?: string | null
          id?: string
          journey_id: string
          status?: string
          template_version?: number
          user_id: string
        }
        Update: {
          completed_at?: string | null
          current_section_id?: string | null
          current_section_number?: number | null
          current_section_unit_number?: number | null
          current_unit_id?: string | null
          current_unit_number?: number
          enrolled_at?: string | null
          id?: string
          journey_id?: string
          status?: string
          template_version?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_journey_enrollments_current_section_id_fkey"
            columns: ["current_section_id"]
            isOneToOne: false
            referencedRelation: "journey_template_sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_journey_enrollments_current_unit_id_fkey"
            columns: ["current_unit_id"]
            isOneToOne: false
            referencedRelation: "journey_template_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_journey_enrollments_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_journey_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_node_completions: {
        Row: {
          completed_at: string | null
          duration_seconds: number | null
          enrollment_id: string | null
          id: string
          journey_id: string
          mood_after: number | null
          mood_before: number | null
          node_id: string
          node_type: string
          response_data: Json | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number | null
          enrollment_id?: string | null
          id?: string
          journey_id: string
          mood_after?: number | null
          mood_before?: number | null
          node_id: string
          node_type: string
          response_data?: Json | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number | null
          enrollment_id?: string | null
          id?: string
          journey_id?: string
          mood_after?: number | null
          mood_before?: number | null
          node_id?: string
          node_type?: string
          response_data?: Json | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_node_completions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "user_journey_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_completions_journey_id_fkey"
            columns: ["journey_id"]
            isOneToOne: false
            referencedRelation: "journey_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_completions_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "journey_template_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_node_progress: {
        Row: {
          completed_at: string | null
          duration_seconds: number | null
          enrollment_id: string
          id: string
          mood_after: number | null
          mood_before: number | null
          node_id: string
          progress: number
          response_data: Json | null
          reward_claimed: boolean
          status: string
          updated_at: string | null
          user_id: string
          xp_earned: number
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number | null
          enrollment_id: string
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          node_id: string
          progress?: number
          response_data?: Json | null
          reward_claimed?: boolean
          status?: string
          updated_at?: string | null
          user_id: string
          xp_earned?: number
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number | null
          enrollment_id?: string
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          node_id?: string
          progress?: number
          response_data?: Json | null
          reward_claimed?: boolean
          status?: string
          updated_at?: string | null
          user_id?: string
          xp_earned?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_node_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "user_journey_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_progress_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "journey_template_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_node_replays: {
        Row: {
          completed_at: string
          enrollment_id: string
          id: string
          node_id: string
          reward_payload: Json
          source: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          enrollment_id: string
          id?: string
          node_id: string
          reward_payload?: Json
          source?: string
          user_id: string
        }
        Update: {
          completed_at?: string
          enrollment_id?: string
          id?: string
          node_id?: string
          reward_payload?: Json
          source?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_node_replays_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "user_journey_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_replays_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "journey_template_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_node_responses: {
        Row: {
          attempt_id: string
          id: string
          node_id: string
          responses: Json
          submitted_at: string
          user_id: string
        }
        Insert: {
          attempt_id: string
          id?: string
          node_id: string
          responses: Json
          submitted_at?: string
          user_id: string
        }
        Update: {
          attempt_id?: string
          id?: string
          node_id?: string
          responses?: Json
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_node_responses_attempt_id_fkey"
            columns: ["attempt_id"]
            isOneToOne: false
            referencedRelation: "node_attempts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_node_responses_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "nodes"
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
      user_streaks: {
        Row: {
          created_at: string | null
          current_streak: number
          last_activity_date: string
          longest_streak: number
          rest_days_used_this_week: number
          streak_freezes_available: number
          updated_at: string | null
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number
          last_activity_date?: string
          longest_streak?: number
          rest_days_used_this_week?: number
          streak_freezes_available?: number
          updated_at?: string | null
          user_id: string
          week_start_date?: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number
          last_activity_date?: string
          longest_streak?: number
          rest_days_used_this_week?: number
          streak_freezes_available?: number
          updated_at?: string | null
          user_id?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
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
      weekly_ai: {
        Row: {
          confidence: number | null
          created_at: string | null
          id: string
          input_tokens: number | null
          output_tokens: number | null
          personalized_reflection: Json | null
          structured_memory: Json | null
          summary: string
          user_id: string
          week_number: number
          year: number
        }
        Insert: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          personalized_reflection?: Json | null
          structured_memory?: Json | null
          summary: string
          user_id: string
          week_number: number
          year: number
        }
        Update: {
          confidence?: number | null
          created_at?: string | null
          id?: string
          input_tokens?: number | null
          output_tokens?: number | null
          personalized_reflection?: Json | null
          structured_memory?: Json | null
          summary?: string
          user_id?: string
          week_number?: number
          year?: number
        }
        Relationships: []
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
      user_ip_totals: {
        Row: {
          today_ip: number | null
          total_ip: number | null
          user_id: string | null
          week_ip: number | null
        }
        Relationships: [
          {
            foreignKeyName: "insight_points_ledger_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_old_challenges: { Args: never; Returns: undefined }
      get_journey_catalog: { Args: never; Returns: Json }
      get_journey_template: { Args: { p_slug: string }; Returns: Json }
      get_node_content: { Args: { p_node_id: string }; Returns: Json }
      get_section_map:
        | { Args: { p_slug: string; p_unit_number?: number }; Returns: Json }
        | {
            Args: {
              p_slug: string
              p_unit_number?: number
              p_view_mode?: string
            }
            Returns: Json
          }
      get_section_units: {
        Args: { p_section_number: number; p_slug: string }
        Returns: Json
      }
      get_user_journey_progress: {
        Args: { p_journey_id: string }
        Returns: Json
      }
      replay_completed_journey_node: {
        Args: { p_enrollment_id: string; p_node_id: string }
        Returns: Json
      }
      update_user_streak: { Args: never; Returns: Json }
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
  graphql_public: {
    Enums: {},
  },
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
