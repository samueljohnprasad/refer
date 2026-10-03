import { AttachmentsContent } from "@/src/components/attachments-content";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/web-popover";
// ponytail: use native expo-symbols instead of lucide
import { SymbolView } from "expo-symbols";
import { Text, View } from "react-native";

/**
 * Web composer "+" button. Instead of navigating to the `/attachments` page,
 * it opens the "Add to chat" UI in a Radix popover anchored to the button.
 */
export function AttachmentsButton() {
  return (
    <Popover>
      <PopoverTrigger
        aria-label="Add to chat"
        className="flex h-7 w-7 items-center justify-center rounded-lg border border-border/40 bg-transparent transition-colors hover:bg-accent"
      >
        <SymbolView name="plus" size={18} tintColor="#8e8e93" />
      </PopoverTrigger>
      <PopoverContent>
        <View className="pb-1 pt-1">
          <Text className="px-5 pb-1 text-[13px] font-medium text-muted-foreground">
            Add to chat
          </Text>
          <AttachmentsContent />
        </View>
      </PopoverContent>
    </Popover>
  );
}
