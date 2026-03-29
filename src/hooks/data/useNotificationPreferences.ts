import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";

export interface NotificationSettings {
    push_enabled: boolean;
    quiet_hours_start: number;
    quiet_hours_end: number;
    max_per_day: number;
    streak_reminders: boolean;
    mood_reminders: boolean;
    habit_reminders: boolean;
    achievement_reminders: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
    push_enabled: true,
    quiet_hours_start: 22,
    quiet_hours_end: 7,
    max_per_day: 1,
    streak_reminders: true,
    mood_reminders: true,
    habit_reminders: true,
    achievement_reminders: true,
};

export function useNotificationPreferences() {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["notification-preferences", user?.id],
        queryFn: async (): Promise<NotificationSettings> => {
            if (!user?.id) return DEFAULT_SETTINGS;

            const { data, error } = await supabase
                .from("user_notification_settings")
                .select("*")
                .eq("user_id", user.id)
                .single();

            if (error || !data) return DEFAULT_SETTINGS;

            return {
                push_enabled: data.push_enabled,
                quiet_hours_start: data.quiet_hours_start ?? 22,
                quiet_hours_end: data.quiet_hours_end ?? 7,
                max_per_day: data.max_per_day ?? 1,
                streak_reminders: data.streak_reminders ?? true,
                mood_reminders: data.mood_reminders ?? true,
                habit_reminders: data.habit_reminders ?? true,
                achievement_reminders: data.achievement_reminders ?? true,
            };
        },
        enabled: !!user?.id,
    });

    const mutation = useMutation({
        mutationFn: async (updates: Partial<NotificationSettings>) => {
            if (!user?.id) throw new Error("Not authenticated");

            const { error } = await supabase
                .from("user_notification_settings")
                .upsert(
                    {
                        user_id: user.id,
                        ...updates,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: "user_id" }
                );

            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["notification-preferences", user?.id],
            });
        },
    });

    return {
        settings: query.data ?? DEFAULT_SETTINGS,
        isLoading: query.isLoading,
        updateSettings: mutation.mutateAsync,
        isUpdating: mutation.isPending,
    };
}
