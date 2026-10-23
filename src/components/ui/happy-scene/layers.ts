import type { ArtLayer } from "./art";
import type { PoseLayer } from "./pose";

export type HappyLayer = {
  pose?: PoseLayer;
  art?: ArtLayer;
  children?: readonly HappyLayer[];
};

// The same hierarchy drives the native rig and the rendered review video.
export const HAPPY_LAYERS: readonly HappyLayer[] = [
  { pose: "shadow", art: "shadow" },
  { pose: "root", children: [
    { pose: "legL", art: "legL" },
    { pose: "legR", art: "legR" },
    { pose: "body", children: [
      { art: "torso" },
      { pose: "head", children: [
        { pose: "earL", art: "earL" },
        { pose: "earR", art: "earR" },
        { art: "head" },
        { pose: "face", children: [
          { art: "face" },
          { pose: "eyes", children: [
            { art: "eyes" },
            { pose: "pupils", art: "pupils" },
          ] },
          { pose: "muzzle", art: "muzzle" },
        ] },
      ] },
      { pose: "armL", art: "armL", children: [{ pose: "foreL", art: "foreL" }] },
      { pose: "armR", art: "armR", children: [{ pose: "foreR", art: "foreR" }] },
    ] },
  ] },
];
