import { Edit02Icon, Mic01Icon } from "@hugeicons/core-free-icons";

export const getEntryTypeIcon = (inputType?: string | null) => {
  switch (inputType) {
    case "typing":
      return Mic01Icon;
    case "voice":
      return Edit02Icon;
    default:
      return Edit02Icon;
  }
};
