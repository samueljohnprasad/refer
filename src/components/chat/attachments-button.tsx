import { Link } from "expo-router";
// ponytail: use native expo-symbols instead of lucide
import { SymbolView } from "expo-symbols";

import { PromptInputAction } from "./prompt-input";

/**
 * Composer "+" button. On native it opens the `/attachments` form sheet; the
 * web variant (`attachments-button.web.tsx`) opens an inline popover instead.
 */
export function AttachmentsButton() {
  return (
    <Link href="/attachments" asChild>
      <PromptInputAction>
        <SymbolView name="plus" size={20} tintColor="#8e8e93" />
      </PromptInputAction>
    </Link>
  );
}
