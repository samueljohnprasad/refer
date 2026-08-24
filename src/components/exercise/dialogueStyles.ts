// ponytail: extracted style constants for clean Dialogue component
export const DIALOGUE_STYLES = {
  container: "flex-1 w-full relative",
  scrollContent: "pb-32 pt-8 px-6", // space for footer and header
  beatContainer: "mb-6 w-full flex-row items-end",
  beatContainerLeft: "justify-start",
  beatContainerRight: "justify-end",
  
  // Message bubbles
  bubble: "px-5 py-4 rounded-2xl max-w-[85%]",
  bubbleLeft: "bg-white border border-brand-border rounded-bl-sm",
  bubbleRight: "bg-sage-100 rounded-br-sm",
  
  // Text
  messageText: "text-lg text-ink font-geist-regular leading-relaxed",
  speakerName: "text-sm text-ink-soft font-geist-medium mb-1.5",
  speakerLeft: "ml-2",
  speakerRight: "mr-2 text-right",
  
  // Earlier summary
  earlierRow: "flex-row items-center justify-center mb-8 px-4",
  earlierLine: "flex-1 h-px bg-brand-border",
  earlierBadge: "bg-brand-surface-soft px-3 py-1.5 rounded-full border border-brand-border mx-3",
  earlierText: "text-xs text-ink-soft font-geist-medium",
  
  // Decisions
  decisionOptionsContainer: "mt-3 space-y-3 w-full max-w-[85%]",
  decisionOptionsLeft: "self-start",
  decisionOptionsRight: "self-end",
  optionCard: "bg-white border-2 border-brand-border rounded-xl p-4 active:bg-brand-surface-soft",
  optionLabel: "text-base text-ink font-geist-medium text-center",
  
  // Feedback
  feedbackContainer: "mt-3 bg-sage-selected border border-sage-200 rounded-xl p-4 w-full max-w-[85%]",
  feedbackContainerLeft: "self-start",
  feedbackContainerRight: "self-end",
  feedbackText: "text-base text-sage-700 font-geist-medium",
  
  // Layout utilities
  insightContainer: "mt-8 pt-8 border-t border-brand-border items-center px-4",
  insightText: "text-xl text-ink font-cormorant text-center",
} as const;
