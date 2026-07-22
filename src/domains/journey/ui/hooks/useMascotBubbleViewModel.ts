import { useCallback, useState } from "react";
import { MASCOT_MESSAGES, MASCOT_SIZE } from "@/src/data/journey/constants";
import { MascotSide } from "@/src/types/journey/enums";

export interface MascotBubbleProps {
  x: number;
  y: number;
  side: MascotSide;
  initialMessage?: string;
  imageKey?: string;
  avatarSize?: number;
  offsetY?: number;
}

function getRandomMessage(exclude: string): string {
  const filtered: readonly string[] = MASCOT_MESSAGES.filter(
    (m: string) => m !== exclude,
  );
  const index: number = Math.floor(Math.random() * filtered.length);
  return filtered[index] ?? MASCOT_MESSAGES[0];
}

export function useMascotBubbleViewModel({
  x,
  y,
  side,
  initialMessage,
  imageKey,
  avatarSize,
  offsetY,
}: MascotBubbleProps) {
  const [message, setMessage] = useState<string>(
    initialMessage ?? MASCOT_MESSAGES[0],
  );

  const isLeft: boolean = side === MascotSide.LEFT;
  const resolvedAvatarSize: number = avatarSize ?? MASCOT_SIZE.avatar;
  const resolvedOffsetY: number = offsetY ?? MASCOT_SIZE.verticalOffset;
  const halfAvatar: number = resolvedAvatarSize / 2;

  const handleTap = useCallback((): void => {
    setMessage((prev: string) => getRandomMessage(prev));
  }, []);

  return {
    message,
    isLeft,
    resolvedAvatarSize,
    resolvedOffsetY,
    halfAvatar,
    handleTap,
    x,
    y,
    side,
    imageKey,
  };
}
