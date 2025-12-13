export const countWords = (text: string): number => {
  if (!text || text.trim().length === 0) {
    return 0;
  }

  return text.trim().split(" ").length;
};
