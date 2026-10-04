import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ConfigurableGlassMenu,
  GlassMenuConfig,
  GlassMenuItem,
} from "@/src/components/ui/ConfigurableGlassMenu";

interface JournalTitleMenuProps {
  title: string;
  subtitle?: string;
  isBookmarked?: boolean | null;
  onBookmark?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
}

export function JournalTitleMenu({
  title,
  subtitle,
  isBookmarked,
  onBookmark,
  onDelete,
  onExport,
}: JournalTitleMenuProps) {
  const { t } = useTranslation("journal");
  const displaySubtitle = subtitle;

  const menuConfig: GlassMenuConfig = useMemo(() => {
    const actionItems: GlassMenuItem[] = [];

    if (onBookmark) {
      actionItems.push({
        type: "button",
        id: "bookmark",
        label: isBookmarked
          ? t("titleMenu.removeBookmark")
          : t("titleMenu.bookmarkEntry"),
        systemImage: isBookmarked ? "bookmark.fill" : "bookmark",
        onPress: onBookmark,
      });
    }

    if (onExport) {
      actionItems.push({
        type: "button",
        id: "export",
        label: t("titleMenu.shareExport"),
        systemImage: "square.and.arrow.up",
        onPress: onExport,
      });
    }

    if (onDelete) {
      actionItems.push({
        type: "button",
        id: "delete",
        label: t("titleMenu.deleteEntry"),
        systemImage: "trash",
        role: "destructive",
        onPress: onDelete,
      });
    }

    return {
      title,
      subtitle: displaySubtitle,
      showChevron: true,
      controlSize: "regular",
      titleTextStyle: "callout",
      sections: [
        {
          id: "actions-section",
          title: t("titleMenu.actions"),
          items: actionItems,
        },
      ],
    };
  }, [title, displaySubtitle, isBookmarked, onBookmark, onExport, onDelete, t]);

  return <ConfigurableGlassMenu config={menuConfig} />;
}
