import Paywall from "@/screens/paywall/Paywall";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";
import JournalEntryScreen from "@/screens/JournalEntryScreen";
import { InsightsType } from "@/network/genAi";

export default function HealthTrackerr() {
  const insights: InsightsType = {
    moodScore: 1,
    suggestedTags: ["stress", "family", "gratitude", "self-care"],
    growthAreas: ["Work-life balance", "Managing stress proactively"],
    positiveInsights: [
      "Strong family support",
      "Healthy coping strategy (walking)",
    ],
    summary:
      "You are feeling stressed by work but supported by family, and walking helped you find calm.",
    mainEmoji: "fine",
    feelings: [
      {
        name: "Hope",
        emoji: "✨",
        colorsGradient: ["#E5F1FF", "#D6E8FF"],
      },
      {
        name: "Support",
        emoji: "😊",
        colorsGradient: ["#FFE5EC", "#FFD6E8"],
      },
      {
        name: "Happiness",
        emoji: "💡",
        colorsGradient: ["#E6FFE5", "#D6FFD6"],
      },
    ],
    aiInsights:
      "You are feeling stressed by work but supported by family, and walking helped you find calm.",
    title: "Stress and Support",
    enrichedTranscript:
      "Today felt like a rollercoaster 🎢 of emotions.\nI woke up anxious 😟 about an upcoming presentation at work 💼 and kept overthinking every detail.\nMy hands were shaky ✋, and I struggled to eat breakfast 🍳.\nLater in the afternoon, I received encouraging feedback 😊 from my manager 👩‍💼 on a smaller project, which lifted my spirits 🌟.\nBy evening, I went for a jog 🏃 in the park 🌳, listening to music 🎶 that made me feel grounded and relaxed 😌.\nI’m still nervous 😬 about tomorrow, but I also feel grateful 🙏 for the support around me and proud 💪 of myself for not giving up today.",
  };

  return (
    <JournalEntryScreen
      insights={insights}
      transcripts={[insights.enrichedTranscript || ""]}
    />
  );
}
