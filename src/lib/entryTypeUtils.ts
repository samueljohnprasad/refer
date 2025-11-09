export const getEntryTypeIcon = (inputType: string | null) => {
  switch (inputType) {
    case "text":
      return "edit-3";
    case "voice":
      return "mic";
    default:
      return "mic";
  }
};

export const getEntryTypeColor = (inputType: string | null) => {
  switch (inputType) {
    case "text":
      return "#6B7280";
    case "voice":
      return "#3B82F6";
    default:
      return "#3B82F6";
  }
};
