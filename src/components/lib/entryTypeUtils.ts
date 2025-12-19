import { Edit02Icon, Mic01Icon } from "@hugeicons/core-free-icons";

export const getEntryTypeIcon = (inputType?: string | null) => {
  switch (inputType) {
    case "typing":
      return Edit02Icon;
    case "voice":
      return Mic01Icon;
    default:
      return Mic01Icon;
  }
};
