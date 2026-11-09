// ponytail: remotion root entry registering WelcomeHero
import React from "react";
import { Composition } from "remotion";
import { WelcomeHero } from "./WelcomeHero";
import { COMP } from "./journey";
import { HappyScenePreview } from "./HappyScene";
import { Reel as ThoughtCatcherReel, TOTAL_FRAMES as THOUGHT_CATCHER_FRAMES } from "./thought-catcher/Reel";
import { COMP as THOUGHT_CATCHER_COMP } from "./thought-catcher/config";
import { HappiPoses } from "./HappiPoses";

export const RemotionRoot: React.FC = () => (
  <>
  <Composition id="HappiPoses" component={HappiPoses} durationInFrames={480} fps={60} width={1312} height={1176} />
  <Composition id="HappyMascot"component={HappyScenePreview} durationInFrames={600} fps={60} width={780} height={1688} />
  <Composition
    id="WelcomeHero"
    component={WelcomeHero}
    durationInFrames={COMP.durationInFrames}
    fps={COMP.fps}
    width={COMP.width}
    height={COMP.height}
  />
  <Composition
    id="ThoughtCatcherReel"
    component={ThoughtCatcherReel}
    durationInFrames={THOUGHT_CATCHER_FRAMES}
    fps={THOUGHT_CATCHER_COMP.fps}
    width={THOUGHT_CATCHER_COMP.width}
    height={THOUGHT_CATCHER_COMP.height}
  />
  </>
);
