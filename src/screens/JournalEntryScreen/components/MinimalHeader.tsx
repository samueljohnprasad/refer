import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { isToday, isYesterday } from "date-fns";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { BookmarkCheck01Icon, BookmarkAdd01Icon } from "@hugeicons/core-free-icons";
import { JournalTitleMenu } from "./JournalTitleMenu";

interface MinimalHeaderProps {
  isEditing: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDone: () => void;
  onSave?: () => void;
  saving?: boolean;
  onDelete?: () => void;
  date?: string | null;
  isBookmarked?: boolean | null;
  onBookmark?: () => void;
  bookmarking?: boolean;
}

const getRelativeDayTitle = (
  dateStr: string | null | undefined,
  translate: (key: string) => string,
  locale: string
): string => {
  if (!dateStr) return translate("entryDetail.header.today");
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return translate("entryDetail.header.today");
  if (isToday(d)) return translate("entryDetail.header.today");
  if (isYesterday(d)) return translate("entryDetail.header.yesterday");
  return d.toLocaleDateString(locale, { weekday: "long", month: "short", day: "numeric" });
};

const getFormattedTime = (
  dateStr: string | null | undefined,
  translate: (key: string) => string,
  locale: string
): string => {
  if (!dateStr) return translate("entryDetail.header.reflection");
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return translate("entryDetail.header.reflection");
  return d.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
};

/**
 * Ultra-minimal header component with clean design
 * Features dynamic date typography and contextual management actions
 */
export const MinimalHeader = React.memo<MinimalHeaderProps>(
  ({
    isEditing,
    onClose,
    onEdit,
    onDone,
    onSave,
    saving = false,
    onDelete,
    date,
    isBookmarked,
    onBookmark,
    bookmarking = false,
  }: MinimalHeaderProps) => {
    const { t, i18n } = useTranslation("journal");
    const dayTitle = getRelativeDayTitle(date, t, i18n.language);
    const formattedTime = getFormattedTime(date, t, i18n.language);

    return (
      <View className="flex-row items-center justify-between px-4 py-4 mb-4">
        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          className="w-10 h-10 items-center justify-center -ml-2"
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t("entryDetail.header.close")}
          accessibilityHint={t("entryDetail.header.closeHint")}
        >
          <Feather name="x" size={24} className="text-ink" />
        </TouchableOpacity>

        {/* Date/Time or Native iOS Menu */}
        <View className="flex-1 items-center">
          {Platform.OS === "ios" ? (
            <JournalTitleMenu
              title={dayTitle}
              subtitle={formattedTime}
              isBookmarked={isBookmarked}
              onBookmark={onBookmark}
              onDelete={onDelete}
            />
          ) : (
            <>
              <Text variant="body-bold">{dayTitle}</Text>
              <Text variant="caption" className="mt-0.5 text-ink-muted">
                {formattedTime}
              </Text>
            </>
          )}
        </View>

        {/* Action buttons */}
        <View className="flex-row items-center gap-2 -mr-1">
          {onDelete && isEditing && (
            <TouchableOpacity
              onPress={onDelete}
              className="w-9 h-9 items-center justify-center rounded-full bg-red-50"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t("entryDetail.header.deleteEntry")}
            >
              <Feather name="trash-2" size={16} color="#EF4444" />
            </TouchableOpacity>
          )}

          {!isEditing && onBookmark && (
            <TouchableOpacity
              onPress={onBookmark}
              disabled={bookmarking}
              className="w-10 h-10 items-center justify-center rounded-full"
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t(isBookmarked ? "entryDetail.removeBookmark" : "entryDetail.addBookmark")}
            >
              <HugeiconsIcon
                icon={isBookmarked ? BookmarkCheck01Icon : BookmarkAdd01Icon}
                size={22}
                color={isBookmarked ? "#4F6354" : "#1C1C1E"} // roughly sage-700 vs ink
                variant={isBookmarked ? "solid" : "stroke"}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={isEditing ? (onSave ?? onDone) : onEdit}
            disabled={saving}
            className={
              isEditing
                ? "bg-sage-700 px-4 py-2 rounded-full shadow-sm"
                : "px-3 py-2"
            }
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              isEditing ? t("entryDetail.header.saveEntry") : t("entryDetail.header.editJournal")
            }
          >
            <Text
              variant="body-bold"
              className={isEditing ? "text-white text-[14px]" : "text-sage-700"}
            >
              {isEditing
                ? saving
                  ? t("entryDetail.header.saving")
                  : t("entryDetail.header.save")
                : t("entryDetail.header.edit")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

MinimalHeader.displayName = "MinimalHeader";
