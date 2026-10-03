import React, { Component, type ReactNode } from "react";
import { View, Text, Pressable } from "react-native";
import JournalCalendarScreen from "@/src/screens/JournalCalendarScreen/JournalCalendarScreen";
import { useTranslation } from "react-i18next";

// ponytail: catch any unhandled render errors on home tab instead of native process abort
export { ErrorBoundary } from "expo-router";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

function HomeErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation("home");

  return (
    <View className="flex-1 items-center justify-center p-6 bg-brand-canvas">
      <Text className="text-lg font-bold text-ink mb-2">{t("errors.loadTitle")}</Text>
      <Text className="text-sm text-ink-muted text-center mb-4">
        {t("errors.loadDescription")}
      </Text>
      <Pressable
        onPress={onRetry}
        className="px-6 py-2.5 bg-brand-primary rounded-full active:opacity-80"
      >
        <Text className="text-white font-semibold">{t("errors.tryAgain")}</Text>
      </Pressable>
    </View>
  );
}

class HomeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[HomeErrorBoundary] Caught error:", error);
  }

  render() {
    if (this.state.hasError) {
      return <HomeErrorFallback onRetry={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}

export default function HomeTab() {
  return (
    <HomeErrorBoundary>
      <JournalCalendarScreen />
    </HomeErrorBoundary>
  );
}
