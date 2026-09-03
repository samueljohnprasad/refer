export const timelineRewindClassNames = {
  screenContent: "flex-1",
  timelineContainer: "gap-4 px-5 pb-10 pt-4",
  eventRow: "flex-row gap-3",
  eventTimeLineContainer: "w-[60px] items-end",
  eventTime: "happy-font-body text-sm leading-5 text-ink-soft",
  eventDot:
    "absolute -right-6 top-1.5 h-2 w-2 rounded-full bg-brand-border-strong",
  eventLine:
    "absolute -bottom-4 -right-[21px] top-[18px] w-0.5 bg-brand-surface-soft",
  eventContent: "flex-1 pl-5",
  eventDescription: "happy-font-body-medium text-base leading-6 text-ink",
  interpretationBlock:
    "mt-6 rounded-2xl border border-brand-border bg-brand-surface-soft p-4",
  interpretationText: "happy-font-body text-base leading-6 text-sage-dark",
} as const;
