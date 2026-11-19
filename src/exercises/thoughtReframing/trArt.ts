// ponytail: the prototype's flat-shape art (.agents/thought-reframing.html `ART`), geometry copied verbatim:
// the ten thinking-pattern scenes, the intro scene and the four path glyphs. It builds SVG XML strings that
// react-native-svg's SvgXml renders as-is, so nothing is re-drawn by hand. Pure data, no JSX or hooks.
// @ts-nocheck verbatim port of untyped prototype helpers

const C = {s1:"#c5d8bc",s2:"#8fb184",s3:"#5f7f58",s4:"#44633f",sun:"#f5b942",sun2:"#e09a24",sky:"#9cc8ec",sky2:"#5f9ed4",
  cor:"#f4a688",cor2:"#dd7b5a",wood:"#c99363",wood2:"#a5714a",sand:"#ead7b5",ink:"#142414",w:"#ffffff",cream:"#fffaf0",wash:"#f6ecd8"};
  const svg = (vb, body, label) => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;
  const mix = (a, b, t) => '#' + [1, 3, 5].map(i => Math.round(parseInt(a.slice(i, i + 2), 16) * (1 - t) + parseInt(b.slice(i, i + 2), 16) * t).toString(16).padStart(2, '0')).join('');
  const f1 = n => +n.toFixed(1);
  const CL = "M10 34 C3 34 0 28 2 23 C3 18 8 16 12 17 C12 9 19 4 27 5 C32 0 42 0 47 6 C55 6 60 13 58 20 C62 23 61 34 52 34 Z";
  const cloud = (x, y, s, fill, shade) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s * 100) / 100})">${shade ? `<path d="${CL}" fill="${shade}" transform="translate(0 3)"/>` : ''}<path d="${CL}" fill="${fill}"/></g>`;
  const spark = (x, y, r, fill) => `<path d="M${x} ${y - r} Q${x + r * .2} ${y - r * .2} ${x + r} ${y} Q${x + r * .2} ${y + r * .2} ${x} ${y + r} Q${x - r * .2} ${y + r * .2} ${x - r} ${y} Q${x - r * .2} ${y - r * .2} ${x} ${y - r} Z" fill="${fill}"/>`;
  const rays = (cx, cy, r1, r2, color, op = 1) => [...Array(8)].map((_, i) => {
    const a = i * Math.PI / 4, c = Math.cos(a), s = Math.sin(a);
    return `<line x1="${f1(cx + c * r1)}" y1="${f1(cy + s * r1)}" x2="${f1(cx + c * r2)}" y2="${f1(cy + s * r2)}" stroke="${color}" stroke-width="4" stroke-linecap="round" opacity="${f1(op * 100) / 100}"/>`;
  }).join('');
  const ln = (d, c = C.ink, w = 3) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="5" fill="${C.ink}" opacity=".07"/>`;
  // a face that can frown (m=-1) or smile (m=1); brow > 0 fades in a worried brow
  const mood = (x, y, s, m, brow = 0) => `<g transform="translate(${f1(x)} ${f1(y)}) scale(${s})">
    <circle cx="-7" cy="0" r="2.8" fill="${C.ink}"/><circle cx="7" cy="0" r="2.8" fill="${C.ink}"/>
    ${brow > 0 ? `<path d="M-12 -5 L-4 -8.5 M12 -5 L4 -8.5" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round" opacity="${f1(Math.min(1, brow) * 100) / 100}"/>` : ''}
    <path d="M-4.5 6 Q0 ${f1(6 + 5 * m)} 4.5 6" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round"/>
    ${m > .3 ? `<circle cx="-11" cy="4" r="2.8" fill="${C.cor}" opacity=".6"/><circle cx="11" cy="4" r="2.8" fill="${C.cor}" opacity=".6"/>` : ''}</g>`;
  const heart = (x, y, s, fill) => `<path d="M${x} ${y + s * .9} C${x - s * 1.25} ${y + s * .1} ${x - s * .65} ${y - s * .85} ${x} ${y - s * .2} C${x + s * .65} ${y - s * .85} ${x + s * 1.25} ${y + s * .1} ${x} ${y + s * .9} Z" fill="${fill}"/>`;
  const camera = `<rect x="8" y="0" width="14" height="9" rx="3" fill="${C.s4}"/><rect x="43" y="1" width="10" height="6" rx="2" fill="${C.sun2}"/>
    <rect x="0" y="8" width="60" height="36" rx="9" fill="${C.s4}"/><rect x="0" y="5" width="60" height="36" rx="9" fill="${C.s3}"/>
    <circle cx="31" cy="25" r="14" fill="${C.s4}"/><circle cx="31" cy="23" r="14" fill="${C.w}"/><circle cx="31" cy="23" r="10" fill="${C.sky}"/>
    <circle cx="31" cy="23" r="4.5" fill="${C.sky2}"/><circle cx="27" cy="19" r="2.4" fill="${C.w}"/><rect x="47" y="11" width="7" height="5" rx="2" fill="${C.sun}"/>`;


  // thinking patterns: one small scene each, drawing what the pattern does
  const PAT = {
    all_or_nothing: `${shadow(28, 50, 16)}<circle cx="28" cy="31" r="18" fill="${C.s2}"/><circle cx="28" cy="28" r="18" fill="${C.w}"/><path d="M28 10 A18 18 0 0 0 28 46 Z" fill="${C.s4}"/>`,
    catastrophizing: `<circle cx="11" cy="46" r="4.5" fill="${C.sun2}"/>${ln('M16 42 C20 36 22 33 25 30', C.s3, 2.5).replace('/>', ' stroke-dasharray="1 5"/>')}
      ${cloud(17, 8, .58, '#adbaa7', '#7f9179')}${ln('M37 28 L33 36 H38 L35 44', C.sun2, 3)}${ln('M26 31 L24 36 M47 31 L45 36', C.sky2, 2.5)}`,
    mind_reading: `${shadow(28, 51, 20)}<circle cx="14" cy="42" r="8" fill="${C.s3}"/>${mood(14, 42, .38, -.5, 1)}<circle cx="43" cy="43" r="7" fill="${C.cor}"/>${mood(43, 43, .34, 0)}
      <ellipse cx="31" cy="18" rx="15" ry="11" fill="${C.sand}"/><ellipse cx="31" cy="16" rx="15" ry="11" fill="${C.w}"/>
      <circle cx="18" cy="31" r="2.6" fill="${C.w}"/><circle cx="15" cy="35.5" r="1.6" fill="${C.w}"/>${mood(31, 15, .55, -1)}`,
    overgeneralizing: `<rect x="4" y="47" width="48" height="4" rx="2" fill="${C.sand}"/>` + [[6, 52, C.sun, C.sun2], [17, 34, C.s3, C.s4], [28, 16, C.s3, C.s4], [39, 0, C.s3, C.s4]].map(([x, a, c, c2]) =>
      `<g transform="rotate(${a} ${x + 7} 47)"><rect x="${x}" y="25" width="7" height="22" rx="2" fill="${c2}"/><rect x="${x}" y="25" width="5.5" height="22" rx="2" fill="${c}"/><circle cx="${x + 3}" cy="31" r="1.3" fill="${C.w}"/><circle cx="${x + 3}" cy="40" r="1.3" fill="${C.w}"/></g>`).join(''),
    personalizing: `<path d="M28 7 L9 50 H47 Z" fill="${C.sun}" opacity=".35"/><rect x="21" y="2" width="14" height="7" rx="3" fill="${C.s4}"/>
      ${shadow(28, 50, 13)}<path d="M19 50 C18 41 22 35 28 35 C34 35 38 41 37 50 Z" fill="${C.cor2}"/><circle cx="28" cy="27" r="7.5" fill="${C.cor}"/>${mood(28, 27, .42, -.6, 1)}`,
    filtering: `<circle cx="19" cy="18" r="4.5" fill="${C.s4}"/><circle cx="29" cy="16" r="5" fill="${C.s4}"/><circle cx="38" cy="19" r="4" fill="${C.s4}"/>
      <path d="M7 22 H49 C47 34 39 40 28 40 C17 40 9 34 7 22 Z" fill="${C.wood2}"/><path d="M7 20 H49 C47 32 39 38 28 38 C17 38 9 32 7 20 Z" fill="${C.wood}"/>
      ${ln('M21 30 v.1 M28 32 v.1 M35 30 v.1', C.wood2, 3)}<circle cx="24" cy="46" r="2.8" fill="${C.sun}"/><circle cx="33" cy="51" r="2.4" fill="${C.sun}"/>`,
    should_statements: `<rect x="12" y="9" width="32" height="42" rx="4" fill="${C.wood2}"/><rect x="12" y="6" width="32" height="42" rx="4" fill="${C.wood}"/>
      <rect x="16" y="12" width="24" height="32" rx="2" fill="${C.w}"/><rect x="21" y="3" width="14" height="7" rx="2.5" fill="${C.s4}"/>
      ${[17, 26, 35].map(y => `<rect x="19" y="${y}" width="5" height="5" rx="1.2" fill="none" stroke="${C.s3}" stroke-width="1.8"/>${ln(`M27 ${y + 2.5} H37`, C.s1, 2.5)}`).join('')}
      ${ln('M19.8 19.5 l1.5 1.5 l3 -3.2', C.s4, 2)}${ln('M20 27 l3 3 M23 27 l-3 3', C.cor2, 2)}`,
    fortune_telling: `${shadow(28, 51, 15)}<path d="M15 51 L19 42 H37 L41 51 Z" fill="${C.wood2}"/><path d="M15 49 L19 40 H37 L41 49 Z" fill="${C.wood}"/>
      <circle cx="28" cy="25" r="16" fill="${C.sky}"/>${cloud(15, 15, .43, '#7f9179')}${ln('M29 30 L26 35 H30 L28 39', C.sun, 2.5)}
      ${ln('M17 20 A12 12 0 0 1 24 13', C.w, 2.5)}`,
    emotional_reasoning: `${heart(15, 26, 10, C.cor2)}${heart(15, 24, 10, C.cor)}${ln('M27 22 h6 M27 28 h6', C.s4, 3)}
      <rect x="37" y="15" width="15" height="21" rx="2.5" fill="${C.sand}"/><rect x="37" y="13" width="15" height="21" rx="2.5" fill="${C.w}"/>${ln('M40 19 H49 M40 24 H47', C.s1, 2.2)}
      <circle cx="49" cy="33" r="6" fill="${C.sun2}"/>${ln('M46.3 33 l1.9 1.9 l3.2 -3.6', C.w, 2)}`,
    labeling: `${shadow(16, 51, 11)}<path d="M7 51 C6 43 10 38 16 38 C22 38 26 43 25 51 Z" fill="${C.s3}"/><circle cx="16" cy="30" r="8" fill="${C.s2}"/>${mood(16, 30, .45, -.4)}
      ${ln('M21 38 Q24 31 27 27', C.wood2, 2)}<path d="M29 18 H45 Q48 18 48 21 V33 Q48 36 45 36 H29 L22 27 Z" fill="${C.wood2}" transform="translate(0 2)"/><path d="M29 18 H45 Q48 18 48 21 V33 Q48 36 45 36 H29 L22 27 Z" fill="${C.sand}"/>
      <circle cx="27" cy="27" r="2" fill="${C.wash}"/>${ln('M33 24 H44 M33 30 H41', C.wood2, 3)}`,
  };

const ART = {
    // the old crooked frame drifts off as a grey cloud; the straight one holds a clearer view
    intro: () => svg('0 0 320 168', `<rect x="0" y="0" width="320" height="168" fill="${C.wash}"/>${shadow(160, 154, 76)}
      ${cloud(26, 44, .82, '#c4ccbf', '#99a893')}${mood(51, 62, .6, -.7, 1)}${ln('M40 84 L37 92 M52 84 L49 92 M64 84 L61 92', C.sky2, 3)}
      ${ln('M88 70 C96 62 102 60 106 62', C.s3, 3).replace('/>', ' stroke-dasharray="1 8"/>')}
      <g transform="rotate(-9 160 84)"><rect x="104" y="32" width="112" height="100" rx="12" fill="none" stroke="${C.s2}" stroke-width="4" stroke-dasharray="9 8" stroke-linecap="round"/></g>
      <rect x="106" y="40" width="108" height="104" rx="12" fill="${C.sun2}"/><rect x="106" y="36" width="108" height="104" rx="12" fill="${C.sun}"/>
      <rect x="118" y="48" width="84" height="80" rx="6" fill="${C.cream}"/>
      ${rays(182, 72, 14, 19, C.sun)}<circle cx="182" cy="72" r="10" fill="${C.sun}"/>
      ${cloud(124, 70, .58, C.w, C.s1)}${mood(141.4, 82.8, .55, 1)}
      <path d="M118 122 L118 112 C134 100 150 104 164 112 C176 106 192 104 202 110 L202 122 C202 126 199 128 196 128 L124 128 C121 128 118 126 118 122 Z" fill="${C.s2}"/>
      <path d="M118 122 L118 120 C138 114 158 116 176 122 C186 119 196 118 202 119 L202 122 C202 126 199 128 196 128 L124 128 C121 128 118 126 118 122 Z" fill="${C.s3}"/>
      ${spark(250, 40, 9, C.sun)}${spark(270, 108, 5, C.s2)}<circle cx="240" cy="130" r="3" fill="${C.s2}"/>`, 'A grey cloud drifting out of a crooked frame, and a straightened frame showing sun'),
    glyph: {
      notice: () => svg('0 0 48 48', `<g transform="translate(6 12) scale(.6)">${camera}</g>`),
      weigh: () => svg('0 0 48 48', `<rect x="22" y="12" width="4" height="26" rx="2" fill="${C.wood2}"/><rect x="14" y="36" width="20" height="5" rx="2.5" fill="${C.wood2}"/>
        <g transform="rotate(-9 24 13)"><rect x="7" y="11" width="34" height="4" rx="2" fill="${C.wood}"/></g>
        ${ln('M7.2 15.7 L2.5 24 M7.2 15.7 L12 24 M40.8 10.3 L36 18.5 M40.8 10.3 L45.5 18.5', C.s4, 1.4)}
        <path d="M1.5 24 H13 A5.8 4 0 0 1 1.5 24 Z" fill="${C.wood2}"/><rect x="4" y="19" width="5.5" height="5" rx="1.5" fill="${C.s3}"/>
        <path d="M35 18.5 H46.5 A5.8 4 0 0 1 35 18.5 Z" fill="${C.wood2}"/><circle cx="40.8" cy="16.3" r="2.4" fill="${C.sun}"/><circle cx="24" cy="13" r="2.5" fill="${C.sun2}"/>`),
      reframe: () => svg('0 0 48 48', `<g transform="rotate(-10 24 24)"><rect x="9" y="11" width="30" height="26" rx="4" fill="none" stroke="${C.s2}" stroke-width="2" stroke-dasharray="4 3"/></g>
        <rect x="10" y="14" width="28" height="25" rx="4" fill="${C.sun2}"/><rect x="10" y="12" width="28" height="25" rx="4" fill="${C.sun}"/><rect x="14" y="16" width="20" height="17" rx="2" fill="${C.cream}"/>
        <circle cx="28" cy="21" r="3" fill="${C.sun}"/><path d="M14 33 V29 C19 25 23 26 26 29 C29 27 32 27 34 28 V33 Z" fill="${C.s3}"/>`),
      check: () => svg('0 0 48 48', `${rays(30, 18, 10, 13, C.sun)}<circle cx="30" cy="18" r="7" fill="${C.sun}"/>${cloud(6, 22, .42, C.w, C.s1)}
        <path d="M2 44 C14 38 28 39 46 43 L46 48 L2 48 Z" fill="${C.s2}"/>`),
    },
  pat: k => svg('0 0 56 56', PAT[k]),
};

export const patternXml = (key: string): string => ART.pat(key);
export const introXml = (): string => ART.intro();
export const glyphXml = (name: "notice" | "weigh" | "reframe" | "check"): string => ART.glyph[name]();
export const PATTERN_KEYS: string[] = Object.keys(PAT);
