// Vector layers traced from assets/images/panda/panda-happy.png.
// All layers share the original 240-unit drawing coordinates.
const ink = "#252525";
const white = "#FCFCFA";
const path = (d: string, fill = ink, stroke = ink, width = 2.5): string =>
  `<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;

export const art = {
  shadow: '<ellipse cx="120" cy="226" rx="70" ry="12" fill="#BCD0AF"/>',
  legL: path("M87 192 Q76 204 79 220 Q82 232 99 226 Q108 222 106 210 L106 193Z"),
  legR: path("M129 192 Q124 211 131 220 Q140 228 156 219 Q163 210 152 202 L148 188Z"),
  torso: path("M83 126 C64 138 62 175 71 194 C80 217 122 219 143 201 C159 184 157 146 143 132Z")
    + path("M86 139 C74 152 73 178 82 192 C95 206 123 206 136 190 C146 175 145 148 132 139Z", white)
    + path("M108 164 C91 147 85 165 97 176 L108 184 C132 171 124 151 108 164Z", "#C9CADF", "none"),
  armL: path("M78 139 Q61 129 51 146 Q43 164 57 174 Q70 178 80 159Z"),
  foreL: path("M57 158 Q43 162 41 179 Q44 191 57 190 Q73 185 72 171Z")
    + '<ellipse cx="51" cy="179" rx="5" ry="4" fill="#FCFCFA"/>',
  armR: path("M143 138 Q160 129 171 147 Q177 161 165 173 Q150 177 141 159Z"),
  foreR: path("M158 159 Q173 160 179 175 Q180 188 167 192 Q151 192 149 177Z")
    + '<ellipse cx="170" cy="180" rx="5" ry="4" fill="#FCFCFA"/>',
  earL: path("M42 62 C18 46 28 13 53 6 C76 0 94 17 88 38Z"),
  earR: path("M147 36 C143 13 172 3 191 16 C212 30 205 56 186 66Z"),
  head: path("M40 62 C53 37 76 31 100 24 C113 17 128 14 126 27 C141 20 155 29 165 34 C192 46 202 70 201 96 C207 118 196 137 177 145 C139 159 83 151 53 140 C27 133 24 111 30 89Z", white)
    + path("M125 27 Q124 33 119 35 M133 29 Q139 34 135 41", "none", ink, 3),
  face: path("M48 78 C54 59 73 57 85 66 C96 74 92 88 82 88 C69 86 57 90 48 84Z")
    + path("M132 82 C139 67 157 72 167 82 C178 94 174 103 164 101 C154 96 139 100 132 94Z")
    + path("M70 47 Q75 44 82 45 M150 54 Q157 54 161 58", "none", ink, 3)
    + '<ellipse cx="46" cy="94" rx="11" ry="5" fill="#F4B5C2"/><ellipse cx="174" cy="112" rx="12" ry="5.5" fill="#F4B5C2"/>',
  eyes: '<ellipse cx="73" cy="78" rx="7" ry="9" fill="#FCFCFA"/><ellipse cx="151" cy="88" rx="7" ry="9" fill="#FCFCFA"/>',
  pupils: '<ellipse cx="75" cy="79" rx="3.8" ry="6" fill="#252525"/><ellipse cx="153" cy="89" rx="3.8" ry="6" fill="#252525"/>',
  muzzle: path("M101 93 Q109 89 115 94 Q113 101 106 100 Q101 98 101 93Z")
    + path("M108 101 Q101 113 91 105 M108 101 Q117 115 126 106", "none", ink, 3),
} as const;

export type ArtLayer = keyof typeof art;
export const svgLayer = (name: ArtLayer): string =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">${art[name]}</svg>`;

export const scenery = {
  background: '<path fill="#F0F5EC" d="M0 0H390V844H0Z"/><path fill="#E3EDDC" d="M0 542Q95 510 190 546T390 528V844H0Z"/>',
  cloud: '<path d="M35 210Q19 210 20 198Q21 187 34 187Q39 169 56 173Q70 174 72 190Q89 188 91 200Q91 210 77 210Z" fill="#FFF"/>',
  plant: '<path d="M324 601Q317 565 327 548" fill="none" stroke="#7C9C6B" stroke-width="3"/><path d="M323 576Q296 573 302 554Q324 554 323 576M325 564Q346 557 341 541Q322 543 325 564" fill="#A8C392"/>',
};
