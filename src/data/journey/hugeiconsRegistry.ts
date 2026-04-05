/**
 * Hugeicons Registry for Journey Nodes
 *
 * Maps the `value` string from NodeIconConfig (type: 'hugeicons') to the
 * actual icon object from @hugeicons/core-free-icons.
 *
 * Adding a new icon = one entry here + one entry in journeyConfig.ts.
 * Zero if/else in rendering code.
 */

import {
    StarIcon,
    CheckmarkCircle01Icon,
    Archive01Icon,
    Mic01Icon,
    Video01Icon,
    GameController01Icon,
    HeadphonesIcon,
    LockIcon,
    Book01Icon,
} from '@hugeicons/core-free-icons';

/** The icon object type expected by HugeiconsIcon's `icon` prop */
export type HugeIconObject = React.ComponentProps<
    typeof import('@hugeicons/react-native').HugeiconsIcon
>['icon'];

/** Lookup map: icon name string → Hugeicons icon object */
export const HUGEICON_REGISTRY: Record<string, HugeIconObject> = {
    star: StarIcon,
    star_locked: LockIcon,
    checkpoint: CheckmarkCircle01Icon,
    checkpoint_locked: LockIcon,
    chest: Archive01Icon,
    chest_locked: LockIcon,
    microphone: Mic01Icon,
    microphone_locked: LockIcon,
    video: Video01Icon,
    video_locked: LockIcon,
    gamepad: GameController01Icon,
    gamepad_locked: LockIcon,
    headphones: HeadphonesIcon,
    headphones_locked: LockIcon,
    book: Book01Icon,
    book_locked: LockIcon,
    lock: LockIcon,
};

/**
 * Resolve a Hugeicons icon object by key.
 * Returns LockIcon as fallback so we never render undefined.
 */
export function getHugeicon(key: string): HugeIconObject {
    return HUGEICON_REGISTRY[key] ?? LockIcon;
}
