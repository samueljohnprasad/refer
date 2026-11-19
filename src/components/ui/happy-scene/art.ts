// Happi rig traced off panda-capture.png on a grid: 1 unit = 4 source px. Floor (130, 238), neck (131, 152).
// Torso is a white front inside a thin ink outline; a black chest band sits under the head; the belly ends in a U whose fold rests on short legs that taper to round feet (panda-capture.png).
// Arms hang straight down to the hip; both segments cap on the elbow at radius 10, so the joint stays one circle at any bend. Forearms taper to an 8.5 mitt.
export const INK = "#252525";
export const WHITE = "#FFFFFF";
export const HEART = "#D3CDEB";
export const SHADOW = "#BCD0AF";
export const TONGUE = "#F2A7A0";
export const STROKE = 3;
export const LINE = { head: 3, tuft: 3, mouth: 2.5, pad: 1.5, fold: 3 } as const;

export const PIVOT = {
  floor: [130, 244],
  body: [130, 227],
  heart: [130, 201],
  neck: [131, 152],
  mouth: [131.75, 134.5],
  earL: [80, 72],
  earR: [178, 76],
  eyes: [132, 109],
  shoulderL: [91, 158],
  elbowL: [91, 180],
  shoulderR: [169, 158],
  elbowR: [169, 180],
  pawL: [91, 204],
  pawR: [169, 204],
} as const;

export const shadow = { cx: 130, cy: 244, rx: 44, ry: 5 } as const;

export const eyes = [
  {
    patch: { cx: 97.5, cy: 107, rx: 25.5, ry: 25, rotate: -8 },
    white: { cx: 99, cy: 107, rx: 18.5, ry: 17.5 },
    pupil: { cx: 100.5, cy: 109, r: 14 },
    glints: [{ cx: 95.5, cy: 101.5, r: 3.3 }, { cx: 91.5, cy: 107.5, r: 2 }],
  },
  {
    patch: { cx: 166, cy: 110.5, rx: 25.5, ry: 25.5, rotate: 6 },
    white: { cx: 165.5, cy: 110.75, rx: 18, ry: 17.75 },
    pupil: { cx: 164.5, cy: 113, r: 14 },
    glints: [{ cx: 159.5, cy: 105, r: 3 }, { cx: 155.5, cy: 111, r: 2 }],
  },
] as const;

export const nose = { cx: 131.75, cy: 123.75, rx: 6, ry: 4.2 } as const;
export const pawPad = { cx: 91, cy: 208, r: 3 } as const;
export const mouthInner = { cx: 131.75, cy: 141.4, rx: 4.7, ry: 2.9 } as const;
// closed happy-squint curve per eye, crossfaded against the eye's white/pupil content by the `cheek` channel
export const happyEyes = [
  "M85 111 C88.5 100 106.5 100 110 111",
  "M153.5 114.5 C157 103.5 175 103.5 178.5 114.5",
] as const;

export const paths = {
  legL: "M96 211 L96.6 219.6 C97.2 225 98.5 231 100.5 235 C102.3 239 105.5 242.5 112 242.5 L117 242.5 C122.5 242.5 126.5 239.5 126.5 235 L126.5 211 Z",
  legR: "M164 211 L163.4 219.6 C162.8 225 161.5 231 159.5 235 C157.7 239 154.5 242.5 148 242.5 L143 242.5 C137.5 242.5 133.5 239.5 133.5 235 L133.5 211 Z",

  torso: "M95 152 C94 170 94.2 200.16 95 212 C95.5 217 96 220 97.5 222 C104 225.5 118 225.8 130 225.8 C142 225.8 156 225.5 162.5 222 C164 220 164.5 217 165 212 C165.8 200.16 166 170 165 152 Z",
  belly: "M98.5 206 C97.8 194.32 99.5 185.56 106 182.64 C113 180.77 122 180.53 130 180.53 C138 180.53 147 180.77 154 182.64 C160.5 185.56 162.2 194.32 161.5 206 L161.5 212 C161 216 159.5 218.5 156 220 C150 223.5 140 224.8 130 224.8 C120 224.8 110 223.5 104 220 C100.5 218.5 99 216 98.5 212 Z",
  bellyFold: "M117 220.6 C120 221.4 123.5 223.6 130 223.6 C136.5 223.6 140 221.4 143 220.6",
  heart: "M130 196.5 C125.83 188.5 116.56 190.5 117.95 199.5 C118.88 205.5 124.9 209.5 130 213 C135.1 209.5 141.12 205.5 142.05 199.5 C143.44 190.5 134.17 188.5 130 196.5 Z",

  upperArmL: "M81 158 A10 10 0 0 1 101 158 L101 180 A10 10 0 0 1 81 180 Z",
  forearmL: "M81 180 A10 10 0 0 1 101 180 L99.5 204 A8.5 8.5 0 0 1 82.5 204 Z",
  upperArmR: "M159 158 A10 10 0 0 1 179 158 L179 180 A10 10 0 0 1 159 180 Z",
  forearmR: "M159 180 A10 10 0 0 1 179 180 L177.5 204 A8.5 8.5 0 0 1 160.5 204 Z",

  earL: "M55.2 50.5 A24.5 23.5 0 1 1 104.2 50.5 A24.5 23.5 0 1 1 55.2 50.5 Z",
  earR: "M160.1 59.8 A24 23.5 0 1 1 208.1 59.8 A24 23.5 0 1 1 160.1 59.8 Z",

  head: "M98.9 51 C111.4 46.8 113.4 47.3 117.5 46.4 C121.8 45.4 127.3 40.4 131.4 40.4 C135.5 40.4 137.8 46.7 137.9 46.7 C177 49.7 210.2 84.8 210.7 122.1 C211.7 142.3 204.6 156.9 185.5 164.5 C170.3 171.3 150.2 170 131 170 C129.8 169.8 126.5 169.4 124 169.1 C121.5 168.8 118.7 168.4 116 168 C113.3 167.6 110.7 167 108 166.4 C105.3 165.8 103 165.2 100 164.3 C97 163.4 93.3 162.4 90 161.2 C86.7 160 83.3 158.8 80 157.3 C76.7 155.8 72.9 153.9 70 152 C67.1 150.1 64.5 148.1 62.4 146 C60.3 143.9 58.9 141.5 57.6 139.2 C56.3 136.9 55.4 134.2 54.5 132 C53.6 129.8 53 128.2 52.5 126 C52 123.8 51.8 121.3 51.6 119 C51.4 116.7 51.3 113.2 51.3 112.1 C51.3 88.2 69.8 61.1 98.9 51 Z",
  hairTufts: "M135.5 41.6 Q138.6 46 136.6 52 Q135.2 56.5 132.6 56.2 M140.5 47 Q147 52 144.5 62",
  mouth: "M124.22 132.15 Q125.97 136 128.43 134.95 Q130.53 134.25 131.93 132.5 Q133.32 134.6 135.43 134.95 Q137.88 136 139.28 132.5",
  // open-mouth+tongue, crossfaded against the closed smile above by the `mouth` channel (binary at >.03)
  mouthOpen: "M122.5 132.2 Q131.75 135.5 141 132.2 C141.3 141 137 145 131.75 145 C126.5 145 122.2 141 122.5 132.2 Z",
} as const;

export const scenery = {
  background: '<path fill="#F0F5EC" d="M0 0H390V844H0Z"/><path fill="#EAF1E5" d="M0 486Q86 454 176 490T390 468V844H0Z"/><path fill="#E3EDDC" d="M0 519Q95 487 190 522T390 504V844H0Z"/>',
  cloud: '<path d="M35 210Q19 210 20 198Q21 187 34 187Q39 169 56 173Q70 174 72 190Q89 188 91 200Q91 210 77 210Z" fill="#FFF"/>',
  plant: '<g transform="translate(0 -45)"><path d="M324 601Q317 565 327 548" fill="none" stroke="#7C9C6B" stroke-width="3"/><path d="M323 576Q296 573 302 554Q324 554 323 576M325 564Q346 557 341 541Q322 543 325 564" fill="#A8C392"/></g>',
} as const;
