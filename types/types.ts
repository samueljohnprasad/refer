import { Database } from "../database.types";

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

export type Insert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type Update<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Relationships<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Relationships"];

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];

export type Functions<T extends keyof Database["public"]["Functions"]> =
  Database["public"]["Functions"][T];

export type CompositeTypes<
  T extends keyof Database["public"]["CompositeTypes"]
> = Database["public"]["CompositeTypes"][T];

export type AgeRange = Enums<"age_range_enum">;
export type Gender = Enums<"gender_enum">;
export type SubscriptionPlan = Enums<"subscription_plan_enum">;
export type UserStatus = Enums<"user_status">;
export type AppPermission = Enums<"app_permission">;
export type AppRole = Enums<"app_role">;
