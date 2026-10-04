import React, { useMemo } from "react";
import { addDays } from "date-fns";
import dayjs from "dayjs";
import { ISO_DATE_FORMAT } from "@/src/utils/date";
import { useFetchDailyMoods } from "@/hooks/data/useFetchDailyMoods";
import DailyChartPage from "./DailyChartPage";

interface DailyChartPageWithDataProps {
  dayOffset: number; // 0 = today, -1 = yesterday, etc.
  baseDate: Date;
  width: number;
  height: number;
  padding: { top: number; bottom: number; left: number; right: number };
  locale: string;
}

const DailyChartPageWithData: React.FC<DailyChartPageWithDataProps> =
  React.memo(({ dayOffset, baseDate, width, height, padding, locale }) => {
    const targetDate = useMemo(
      () => addDays(baseDate, dayOffset),
      [baseDate, dayOffset],
    );
    const targetDateStr = useMemo(
      () => dayjs(targetDate).format(ISO_DATE_FORMAT),
      [targetDate],
    );

    const { groupedMoods, isLoading } = useFetchDailyMoods({
      targetDate: targetDateStr,
    });

    return (
      <DailyChartPage
        targetDate={targetDate}
        emotionsData={groupedMoods}
        width={width}
        height={height}
        padding={padding}
        isLoading={isLoading}
        locale={locale}
      />
    );
  });
export default DailyChartPageWithData;
