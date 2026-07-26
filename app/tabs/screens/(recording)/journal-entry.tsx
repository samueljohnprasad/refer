import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAtomValue } from "jotai";
import { selectedJournalEntryAtom } from "@/src/atoms/journalEntryAtom";
import JournalEntryScreen from "@/src/screens/JournalEntryScreen/JournalEntryScreen";
import { useRouter, Stack, useLocalSearchParams, Link } from "expo-router";
import { supabase } from "@/src/network/auth/supabase";
import { JournalEntry } from "@/hooks/data/types";

export default function JournalEntryRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Try to use the pre-loaded atom first (fastest, supports immediate transition)
  const atomEntry = useAtomValue(selectedJournalEntryAtom);
  const [entry, setEntry] = useState<JournalEntry | null>(atomEntry);
  const [loading, setLoading] = useState(!atomEntry && !!id);

  // Fallback: If not in atom, fetch it by ID
  useEffect(() => {
    if (!atomEntry && id) {
      const fetchEntry = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("journal_entries")
          .select("*, journal_ai!left(*)")
          .eq("id", id)
          .single();
          
        if (data && !error) {
          setEntry(data as any);
        }
        setLoading(false);
      };
      fetchEntry();
    } else if (atomEntry) {
      setEntry(atomEntry);
    }
  }, [id, atomEntry]);

  if (loading || !entry) {
    return <View className="flex-1 bg-brand-surface justify-center items-center"><ActivityIndicator /></View>;
  }

  return (
    <View className="flex-1">
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          presentation: "fullScreenModal",
        }}
      />
      <JournalEntryScreen insights={entry} onClose={() => router.back()} />
    </View>
  );
}
