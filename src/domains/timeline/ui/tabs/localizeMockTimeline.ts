import type { TFunction } from 'i18next';

type Translate = TFunction<'timelineSamples'>;

type MockTimelineItem = {
  aiInsight: null | {
    id: string;
    summary: string;
    timelineSummary?: string;
  };
};

function localizeInsight<T extends NonNullable<MockTimelineItem['aiInsight']>>(insight: T, t: Translate): T {
  const localized = {
    ...insight,
    summary: t(`records.${insight.id}.summary`, { defaultValue: insight.summary }),
  };

  if (insight.timelineSummary) {
    localized.timelineSummary = t(`records.${insight.id}.timelineSummary`, {
      defaultValue: insight.timelineSummary,
    });
  }

  return localized;
}

export function localizeMockTimeline<T extends MockTimelineItem>(items: T[], t: Translate): T[] {
  return items.map(item => {
    if (!item.aiInsight) return item;

    return {
      ...item,
      aiInsight: localizeInsight(item.aiInsight, t),
    };
  });
}
