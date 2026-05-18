import {
  BookOpen01Icon,
  Brain01Icon,
  FastWindIcon,
  FavouriteIcon,
  Idea01Icon,
  MirrorIcon,
  Moon01Icon,
  RepeatIcon,
  Shield01Icon,
  StarIcon,
  Target03Icon,
  ToolsIcon,
} from "@hugeicons/core-free-icons";

import type { HugeIconObject } from "@/src/data/journey/hugeiconsRegistry";

export const JOURNEY_UNIT_ICON_REGISTRY: Record<string, HugeIconObject> = {
  brain: Brain01Icon,
  thought: Idea01Icon,
  heart: FavouriteIcon,
  toolbox: ToolsIcon,
  target: Target03Icon,
  cycle: RepeatIcon,
  wind: FastWindIcon,
  shield: Shield01Icon,
  trophy: StarIcon,
  star: StarIcon,
  moon: Moon01Icon,
  reflect: MirrorIcon,
};

export function getJourneyUnitIcon(key?: string | null): HugeIconObject {
  if (!key) {
    return BookOpen01Icon;
  }

  return JOURNEY_UNIT_ICON_REGISTRY[key] ?? BookOpen01Icon;
}
