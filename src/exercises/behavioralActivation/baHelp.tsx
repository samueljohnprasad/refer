// ponytail: the crisis path (.agents/behavioral-activation.html's openHelp): there is no free text here, so
// no phrase check — a link where mood is very low opens the help sheet, and Happi steps aside for the rest
// of the run. The flag is module-level so every step's Happi hears it; the intro resets it.
import React, { useState, useSyncExternalStore } from "react";
import { Pressable, Text } from "react-native";
import { HelpSheetModal } from "@/src/domains/home/ui/containers/HelpRowWithSheet";

let crisis = false;
const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => (listeners.add(fn), () => void listeners.delete(fn));
const setCrisis = (v: boolean) => { crisis = v; listeners.forEach((fn) => fn()); };

export const resetBaCrisis = (): void => setCrisis(false);
export const useBaCrisis = (): boolean => useSyncExternalStore(subscribe, () => crisis);

export function BaHelpLink({ text }: { text: string }): React.JSX.Element {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Pressable
        accessibilityRole="button"
        onPress={() => { setCrisis(true); setOpen(true); }}
        className="mt-2 min-h-11 justify-center"
      >
        <Text className="text-t-sub font-semibold text-happy-accent underline">{text}</Text>
      </Pressable>
      <HelpSheetModal visible={open} onClose={() => setOpen(false)} />
    </>
  );
}
