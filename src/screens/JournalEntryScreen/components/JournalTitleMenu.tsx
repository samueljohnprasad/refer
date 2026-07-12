import React, { useState, useMemo } from "react";
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
  const displaySubtitle = subtitle;

  const menuConfig: GlassMenuConfig = useMemo(() => {
    const actionItems: GlassMenuItem[] = [];

    if (onBookmark) {
      actionItems.push({
        type: "button",
        id: "bookmark",
        label: isBookmarked ? "Remove Bookmark" : "Bookmark Entry",
        systemImage: isBookmarked ? "bookmark.fill" : "bookmark",
        onPress: onBookmark,
      });
    }

    if (onExport) {
      actionItems.push({
        type: "button",
        id: "export",
        label: "Share & Export Entry",
        systemImage: "square.and.arrow.up",
        onPress: onExport,
      });
    }

    if (onDelete) {
      actionItems.push({
        type: "button",
        id: "delete",
        label: "Delete Entry",
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
      sections: [
        {
          id: "actions-section",
          title: "CBT Journal Actions",
          items: actionItems,
        },
      ],
    };
  }, [
    title,
    displaySubtitle,
    isBookmarked,
    onBookmark,
    onExport,
    onDelete,
  ]);

  return <ConfigurableGlassMenu config={menuConfig} />;
}
