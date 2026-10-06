import React from "react";
import { View, Text } from "react-native";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

interface TimelineSectionHeaderProps {
  readonly date: number;
  readonly mode?: "days" | "weeks" | "months";
}

const MONTH_FORMAT: Intl.DateTimeFormatOptions = { month: "short" };
const WEEK_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
};

interface TimelineDateProps {
  readonly date: Date;
  readonly locale: string;
  readonly todayLabel: string;
  readonly yesterdayLabel: string;
}

function formatMonth(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, MONTH_FORMAT)
    .format(date)
    .toLocaleUpperCase(locale);
}

function formatYear(date: Date, locale: string): string {
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(
    date.getFullYear(),
  );
}

function formatDay(date: Date, locale: string): string {
  return new Intl.NumberFormat(locale, { useGrouping: false }).format(
    date.getDate(),
  );
}

function isSameMonth(startDate: Date, endDate: Date): boolean {
  return (
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getFullYear() === endDate.getFullYear()
  );
}

function formatWeekDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, WEEK_DATE_FORMAT).format(date);
}

function getWeekDateLabels(startDate: Date, locale: string) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  if (isSameMonth(startDate, endDate)) {
    return {
      first: formatMonth(startDate, locale),
      second: `${formatDay(startDate, locale)}–${formatDay(endDate, locale)}`,
      year: formatYear(startDate, locale),
    };
  }
  return {
    first: formatWeekDate(startDate, locale),
    second: formatWeekDate(endDate, locale),
    year: formatYear(startDate, locale),
  };
}

function MonthTimelineDate({ date, locale }: TimelineDateProps) {
  return (
    <View className="w-full items-center py-1">
      <Text
        className="happy-font-body-semibold text-[13px] text-ink"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {formatMonth(date, locale)}
      </Text>
      <Text
        className="happy-font-body-semibold mt-px text-[10px] tracking-[0.5px] text-ink-muted"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {formatYear(date, locale)}
      </Text>
    </View>
  );
}

function WeekTimelineDate({ date, locale }: TimelineDateProps) {
  const labels = getWeekDateLabels(date, locale);

  return (
    <View className="w-full items-center py-1">
      <Text
        className="happy-font-body-semibold text-center text-[10px] text-ink"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {labels.first}
      </Text>
      <Text
        className="happy-font-body-semibold text-center text-[10px] text-ink"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {labels.second}
      </Text>
      <Text
        className="happy-font-body-semibold mt-0.5 text-[9px] tracking-[0.5px] text-ink-muted"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {labels.year}
      </Text>
    </View>
  );
}

function getRelativeDayLabel(
  date: number,
  todayLabel: string,
  yesterdayLabel: string,
): string | undefined {
  const elapsedDays = dayjs().startOf("day").diff(dayjs(date).startOf("day"), "day");
  return new Map([
    [0, todayLabel],
    [1, yesterdayLabel],
  ]).get(elapsedDays);
}

function RelativeDayTimelineDate({ label }: { label: string }) {
  return (
    <View className="w-full items-center">
      <Text className="happy-font-body-semibold text-[10px] tracking-[0.2px] text-ink-soft">
        {label}
      </Text>
    </View>
  );
}

function DayTimelineDate({ date, locale, todayLabel, yesterdayLabel }: TimelineDateProps) {
  const relativeLabel = getRelativeDayLabel(
    date.getTime(),
    todayLabel,
    yesterdayLabel,
  );
  if (relativeLabel) {
    return <RelativeDayTimelineDate label={relativeLabel} />;
  }

  const dateLabel = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  }).format(date);

  return (
    <View className="w-full items-center">
      <Text
        className="happy-font-body-semibold text-[10px] text-ink-soft"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {dateLabel}
      </Text>
      <Text
        className="happy-font-body mt-px text-[9px] tracking-[0.5px] text-ink-muted"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {formatYear(date, locale)}
      </Text>
    </View>
  );
}

const DATE_COMPONENTS = {
  days: DayTimelineDate,
  weeks: WeekTimelineDate,
  months: MonthTimelineDate,
} satisfies Record<NonNullable<TimelineSectionHeaderProps["mode"]>, React.FC<TimelineDateProps>>;

export const TimelineSectionHeader: React.FC<TimelineSectionHeaderProps> =
  React.memo(({ date, mode = "days" }) => {
    const { t, i18n } = useTranslation("common");
    const locale = i18n.language;
    const sectionDate = new Date(date);
    const DateComponent = DATE_COMPONENTS[mode];
    return (
      <DateComponent
        date={sectionDate}
        locale={locale}
        todayLabel={t("timeline.todayLabel")}
        yesterdayLabel={t("timeline.yesterdayLabel")}
      />
    );
  });

TimelineSectionHeader.displayName = "TimelineSectionHeader";
