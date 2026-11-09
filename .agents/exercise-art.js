/* Exercise illustrations for the prototypes (svg-art skill).
   One scene per exercise, each drawing what the exercise does, so no two tiles share a picture.
   Style: flat chunky shapes with a darker underside (the same rim language as the buttons),
   ink only for faces and tiny details, 160x120 canvas sitting on the category wash.
   Subset only (path, circle, ellipse, rect, line, text, g transform) so tools/render-art.mjs can rasterize it.
   Usage: ART.thought_catcher() -> "<svg>…</svg>" · GLYPH.loop -> 24px line icon */
(() => {
  const C = {
    s1: "#c5d8bc", s2: "#8fb184", s3: "#5f7f58", s4: "#44633f",
    sun: "#f5b942", sun2: "#e09a24", sky: "#9cc8ec", sky2: "#5f9ed4",
    cor: "#f4a688", cor2: "#dd7b5a", lav: "#c3b3ea", lav2: "#9a83d4",
    wood: "#c99363", wood2: "#a5714a", sand: "#ead7b5", ink: "#142414", w: "#ffffff", cream: "#fffaf0",
  };
  const svg = (body, label) => `<svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}>${body}</svg>`;
  const shadow = (cx, rx, cy = 106) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="5" fill="${C.ink}" opacity=".07"/>`;
  // a small kind face; s scales it so it fits a pot, a blob or a cloud
  const face = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="-6" cy="0" r="2.6" fill="${C.ink}"/><circle cx="6" cy="0" r="2.6" fill="${C.ink}"/>
    <path d="M-3.5 5 Q0 8.5 3.5 5" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="-10.5" cy="4" r="2.8" fill="${C.cor}" opacity=".55"/><circle cx="10.5" cy="4" r="2.8" fill="${C.cor}" opacity=".55"/></g>`;
  const cloud = (x, y, s, fill, shade) => {
    const d = "M10 34 C3 34 0 28 2 23 C3 18 8 16 12 17 C12 9 19 4 27 5 C32 0 42 0 47 6 C55 6 60 13 58 20 C62 23 61 34 52 34 Z";
    return `<g transform="translate(${x} ${y}) scale(${s})">${shade ? `<path d="${d}" fill="${shade}" transform="translate(0 3)"/>` : ""}<path d="${d}" fill="${fill}"/></g>`;
  };
  const spark = (x, y, r, fill) => `<path d="M${x} ${y - r} Q${x + r * .2} ${y - r * .2} ${x + r} ${y} Q${x + r * .2} ${y + r * .2} ${x} ${y + r} Q${x - r * .2} ${y + r * .2} ${x - r} ${y} Q${x - r * .2} ${y - r * .2} ${x} ${y - r} Z" fill="${fill}"/>`;
  const heart = (x, y, s, fill) => `<path d="M${x} ${y + s * .9} C${x - s * 1.25} ${y + s * .1} ${x - s * .65} ${y - s * .85} ${x} ${y - s * .2} C${x + s * .65} ${y - s * .85} ${x + s * 1.25} ${y + s * .1} ${x} ${y + s * .9} Z" fill="${fill}"/>`;
  const leaf = (x, y, rot, fill, rib = C.w) => `<g transform="translate(${x} ${y}) rotate(${rot})">
    <path d="M0 0 C8 -11 24 -11 30 0 C24 11 8 11 0 0 Z" fill="${fill}"/><path d="M3 0 L26 0" stroke="${rib}" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></g>`;
  const stone = (cx, cy, rx, ry, top, side) => `<ellipse cx="${cx}" cy="${cy + 4}" rx="${rx}" ry="${ry}" fill="${side}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${top}"/>`;
  const rays = (cx, cy, r1, r2, color, n = 8, w = 3) => [...Array(n)].map((_, i) => {
    const a = i * 2 * Math.PI / n, c = Math.cos(a), s = Math.sin(a), f = v => v.toFixed(1);
    return `<line x1="${f(cx + c * r1)}" y1="${f(cy + s * r1)}" x2="${f(cx + c * r2)}" y2="${f(cy + s * r2)}" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  }).join("");

  const ART = {
    // a thought drifting into a net: you catch it before it lands
    thought_catcher: () => svg(`${shadow(64, 38)}
      <line x1="34" y1="104" x2="74" y2="64" stroke="${C.wood2}" stroke-width="8" stroke-linecap="round"/>
      <line x1="34" y1="102" x2="73" y2="63" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>
      <path d="M74 62 C70 82 84 100 101 100 C117 100 126 84 124 60 Z" fill="${C.w}" opacity=".9"/>
      <path d="M86 64 C86 78 92 92 101 98 M101 62 C101 76 104 88 109 97 M114 61 C116 72 118 82 119 90 M77 74 C92 79 108 79 124 72 M82 87 C95 91 107 91 119 86" fill="none" stroke="${C.s1}" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="99" cy="60" rx="26" ry="8" fill="none" stroke="${C.s3}" stroke-width="5"/>
      ${cloud(78, 12, .7, C.w, C.s1)}${face(99, 25, .75)}
      <circle cx="127" cy="31" r="4" fill="${C.w}"/><circle cx="135" cy="23" r="2.6" fill="${C.w}"/>`),

    // the same view, re-hung straight: a dashed crooked frame behind, the new one in front
    thought_reframing: () => svg(`${shadow(82, 40)}
      <g transform="rotate(-13 80 60)"><rect x="47" y="31" width="66" height="56" rx="9" fill="none" stroke="${C.s2}" stroke-width="4" stroke-dasharray="7 6" stroke-linecap="round"/></g>
      <rect x="50" y="34" width="64" height="56" rx="9" fill="${C.sun2}"/>
      <rect x="50" y="30" width="64" height="56" rx="9" fill="${C.sun}"/>
      <rect x="58" y="38" width="48" height="40" rx="5" fill="${C.cream}"/>
      <circle cx="91" cy="53" r="8" fill="${C.sun}"/>
      <path d="M58 78 L58 70 C66 62 76 64 84 70 C90 66 100 64 106 68 L106 78 Z" fill="${C.s2}"/>
      <path d="M58 78 L58 74 C70 70 82 72 94 76 C99 74 103 73 106 74 L106 78 Z" fill="${C.s3}"/>
      ${spark(126, 28, 7, C.sun)}${spark(38, 40, 4, C.w)}`),

    // three good things kept in a jar
    gratitude_reframe: () => svg(`${shadow(80, 30)}
      <path d="M58 48 C53 56 53 94 61 101 C69 106 91 106 99 101 C107 94 107 56 102 48 Z" fill="${C.w}" opacity=".75"/>
      <path d="M56 86 C57 95 59 99 61 101 C69 106 91 106 99 101 C101 99 103 95 104 86 C95 92 65 92 56 86 Z" fill="${C.s1}" opacity=".8"/>
      ${heart(70, 82, 8, C.cor)}
      <g transform="rotate(14 90 74)"><rect x="82" y="66" width="16" height="14" rx="2.5" fill="${C.sun}"/><line x1="85" y1="71" x2="95" y2="71" stroke="${C.w}" stroke-width="1.8" stroke-linecap="round"/><line x1="85" y1="75" x2="92" y2="75" stroke="${C.w}" stroke-width="1.8" stroke-linecap="round"/></g>
      ${leaf(68, 64, -28, C.s2)}${heart(91, 93, 5, C.cor2)}
      <path d="M58 48 C53 56 53 94 61 101 C69 106 91 106 99 101 C107 94 107 56 102 48" fill="none" stroke="${C.s2}" stroke-width="3" stroke-linecap="round"/>
      <path d="M65 58 C63 68 63 80 65 88" fill="none" stroke="${C.w}" stroke-width="3.5" stroke-linecap="round"/>
      <rect x="59" y="36" width="42" height="13" rx="5" fill="${C.wood}"/><rect x="59" y="44" width="42" height="5" rx="2" fill="${C.wood2}"/>
      ${spark(116, 40, 6, C.sun)}<circle cx="44" cy="58" r="2.6" fill="${C.sun}"/>`),

    // stepping stones over water; the middle one, the belief, is the one we stand on
    abc_analysis: () => svg(`<path d="M8 86 C36 78 58 92 82 86 C106 80 128 92 152 86 L152 104 C128 110 106 98 82 104 C58 110 36 98 8 104 Z" fill="${C.sky}" opacity=".55"/>
      <path d="M24 95 L36 95 M96 99 L110 99 M126 93 L136 93" stroke="${C.w}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/>
      ${stone(42, 82, 17, 7, C.s2, C.s3)}${stone(80, 70, 21, 9, C.sun, C.sun2)}${stone(118, 82, 17, 7, C.s2, C.s3)}
      <path d="M52 72 Q60 56 68 62 M92 62 Q100 56 108 72" fill="none" stroke="${C.s3}" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/>
      <text x="42" y="86" text-anchor="middle" font-family="Nunito,system-ui,sans-serif" font-weight="800" font-size="13" fill="${C.w}">A</text>
      <text x="80" y="75" text-anchor="middle" font-family="Nunito,system-ui,sans-serif" font-weight="800" font-size="15" fill="${C.ink}">B</text>
      <text x="118" y="86" text-anchor="middle" font-family="Nunito,system-ui,sans-serif" font-weight="800" font-size="13" fill="${C.w}">C</text>
      ${spark(80, 40, 7, C.sun)}`),

    // one small thing: a sprout just up in its pot, the sun already on it
    behavioral_activation: () => svg(`${shadow(80, 30)}
      ${rays(126, 30, 15, 20, C.sun, 8)}<circle cx="126" cy="30" r="10" fill="${C.sun}"/>
      <path d="M80 72 C80 62 78 54 80 42" fill="none" stroke="${C.s3}" stroke-width="4" stroke-linecap="round"/>
      <path d="M79 58 C66 60 60 52 61 43 C70 43 78 49 79 58 Z" fill="${C.s2}"/>
      <path d="M81 49 C93 50 100 42 98 32 C88 32 81 40 81 49 Z" fill="${C.s3}"/>
      <path d="M61 78 L99 78 L94 104 L66 104 Z" fill="${C.cor}"/>
      <path d="M63 93 L97 93 L94 104 L66 104 Z" fill="${C.cor2}" opacity=".45"/>
      <rect x="56" y="70" width="48" height="11" rx="4" fill="${C.cor2}"/>
      ${face(80, 88, .8)}`),

    // the square you trace with your breath, a quarter already drawn
    box_breathing: () => svg(`${shadow(80, 34, 98)}
      <rect x="50" y="20" width="60" height="60" rx="14" fill="${C.w}" opacity=".7"/>
      <rect x="50" y="20" width="60" height="60" rx="14" fill="none" stroke="${C.sky}" stroke-width="6"/>
      <path d="M64 20 L96 20 C104 20 110 26 110 34 L110 50" fill="none" stroke="${C.sky2}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="80" cy="50" r="13" fill="${C.sky}" opacity=".45"/><circle cx="80" cy="50" r="6" fill="${C.sky2}" opacity=".7"/>
      <circle cx="110" cy="50" r="7" fill="${C.w}" stroke="${C.sky2}" stroke-width="3"/>
`),

    // a sleepy moon and three breaths: in 4, hold 7, out 8
    breathing_478: () => svg(`${shadow(92, 42)}
      <path d="M56 22 A22 22 0 1 0 78 56 A18 18 0 1 1 56 22 Z" fill="${C.sun}"/>
      <path d="M47 45 Q50 48 53 45 M59 47 Q62 50 65 47" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="47" cy="51" r="2.6" fill="${C.cor}" opacity=".55"/>
      <rect x="90" y="78" width="12" height="24" rx="6" fill="${C.sky}"/>
      <rect x="108" y="60" width="12" height="42" rx="6" fill="${C.sky}"/><rect x="108" y="60" width="12" height="20" rx="6" fill="${C.sky2}"/>
      <rect x="126" y="54" width="12" height="48" rx="6" fill="${C.sky}"/>
      ${spark(104, 28, 5, C.w)}<circle cx="130" cy="34" r="2.4" fill="${C.w}"/><circle cx="30" cy="70" r="2" fill="${C.w}"/>`),

    // a cairn of five stones, each one a sense you name
    grounding_54321: () => svg(`${shadow(80, 36, 104)}
      ${stone(80, 92, 30, 9, C.wood, C.wood2)}${stone(78, 78, 24, 8, C.s2, C.s3)}${stone(82, 65, 18, 7, C.sky, C.sky2)}
      ${stone(79, 54, 13, 6, C.cor, C.cor2)}${stone(81, 45, 8, 5, C.sun, C.sun2)}
      <path d="M42 104 Q44 95 47 104 M50 104 Q51 98 53 104 M110 104 Q113 94 116 104 M118 104 Q119 99 121 104" fill="none" stroke="${C.s3}" stroke-width="2.5" stroke-linecap="round"/>
      ${spark(110, 34, 5, C.sun)}`),

    // a resting body, a soft band of attention passing down it
    body_scan_pmr: () => svg(`${shadow(80, 30)}
      <path d="M64 94 C62 77 66 62 80 60 C94 62 98 77 96 94 Z" fill="${C.lav}"/>
      <path d="M48 98 C48 89 62 86 80 91 C98 86 112 89 112 98 C112 104 48 104 48 98 Z" fill="${C.lav2}"/>
      <circle cx="80" cy="40" r="15" fill="${C.lav}"/>
      <path d="M72 40 Q75 43 78 40 M82 40 Q85 43 88 40" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
      <path d="M77 47 Q80 49.5 83 47" fill="none" stroke="${C.ink}" stroke-width="2" stroke-linecap="round"/>
      <rect x="40" y="66" width="80" height="12" rx="6" fill="${C.sky}" opacity=".55"/>
      <line x1="40" y1="72" x2="120" y2="72" stroke="${C.sky2}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M48 54 Q44 50 48 46 M112 54 Q116 50 112 46" fill="none" stroke="${C.sky2}" stroke-width="2.5" stroke-linecap="round"/>`),

    // one minute on a soft clock, a quarter gone
    mindful_breathing_1min: () => svg(`${shadow(80, 32)}
      <rect x="74" y="20" width="12" height="9" rx="3" fill="${C.s3}"/>
      <circle cx="80" cy="63" r="33" fill="${C.s3}"/>
      <circle cx="80" cy="60" r="33" fill="${C.w}"/>
      <path d="M80 60 L80 34 A26 26 0 0 1 106 60 Z" fill="${C.sky}"/>
      <line x1="80" y1="60" x2="104" y2="60" stroke="${C.ink}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="80" cy="60" r="3.5" fill="${C.ink}"/>
      <path d="M26 70 C32 60 40 74 46 64 M114 64 C120 74 128 60 134 70" fill="none" stroke="${C.sky2}" stroke-width="3" stroke-linecap="round"/>`),

    // the fear's shadow is huge; the thing casting it is small
    decatastrophizing: () => svg(`<path d="M136 58 L98 104 L128 104 Z" fill="${C.sun}" opacity=".22"/>
      <path d="M24 104 C20 80 24 52 38 38 L36 22 L47 32 C53 28 61 28 67 32 L78 22 L76 38 C90 52 94 80 90 104 Z" fill="${C.lav2}" opacity=".45"/>
      <ellipse cx="50" cy="54" rx="3" ry="4" fill="${C.w}" opacity=".8"/><ellipse cx="65" cy="54" rx="3" ry="4" fill="${C.w}" opacity=".8"/>
      ${shadow(108, 16)}
      <path d="M94 104 C92 92 98 82 108 82 C118 82 124 92 122 104 Z" fill="${C.cor}"/>
      <path d="M94 104 C94 100 95 97 96 95 C102 99 114 99 120 95 C121 97 122 100 122 104 Z" fill="${C.cor2}" opacity=".5"/>
      ${face(108, 93, .7)}
      <line x1="140" y1="66" x2="140" y2="104" stroke="${C.wood2}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="138" cy="58" r="8" fill="${C.sun}"/>`),

    // a signpost at a fork: act on it, or let it go
    worry_decision_tree: () => svg(`<path d="M80 108 C80 92 66 84 34 80" fill="none" stroke="${C.sand}" stroke-width="12" stroke-linecap="round"/>
      <path d="M80 108 C80 92 94 84 126 80" fill="none" stroke="${C.sand}" stroke-width="12" stroke-linecap="round"/>
      <rect x="77" y="32" width="6" height="72" rx="3" fill="${C.wood2}"/>
      <path d="M50 36 L76 36 L76 51 L50 51 L42 43.5 Z" fill="${C.s3}"/>
      <path d="M53 43.5 L57.5 48 L65 39.5" fill="none" stroke="${C.w}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M84 56 L110 56 L118 63.5 L110 71 L84 71 Z" fill="${C.cor}"/>
      <path d="M90 64 C94 59 100 68 106 62" fill="none" stroke="${C.w}" stroke-width="3" stroke-linecap="round"/>
      <circle cx="80" cy="31" r="4.5" fill="${C.wood2}"/>
      <path d="M30 96 Q32 88 35 96 M128 96 Q131 87 134 96" fill="none" stroke="${C.s3}" stroke-width="2.5" stroke-linecap="round"/>`),

    // a ladder toward the sun, two rungs climbed, standing on the easiest one
    fear_ladder: () => svg(`${shadow(80, 30)}
      ${rays(136, 26, 12, 16, C.sun, 8)}<circle cx="136" cy="26" r="8.5" fill="${C.sun}"/>
      <line x1="60" y1="106" x2="76" y2="18" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>
      <line x1="96" y1="106" x2="112" y2="18" stroke="${C.wood}" stroke-width="5" stroke-linecap="round"/>
      <line x1="62.5" y1="92" x2="98.5" y2="92" stroke="${C.s3}" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="65.5" y1="76" x2="101.5" y2="76" stroke="${C.s3}" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="68.4" y1="60" x2="104.4" y2="60" stroke="${C.wood2}" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="71.3" y1="44" x2="107.3" y2="44" stroke="${C.wood2}" stroke-width="4.5" stroke-linecap="round"/>
      <line x1="74.2" y1="28" x2="110.2" y2="28" stroke="${C.wood2}" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M73 76 C72 66 77 60 84 60 C91 60 96 66 95 76 Z" fill="${C.cor}"/>
      ${face(84, 68, .6)}`),

    // thoughts as leaves on a stream; you watch them pass
    detached_mindfulness: () => svg(`<path d="M6 70 C40 60 70 82 100 72 C122 65 140 70 154 66 L154 94 C132 100 112 88 90 96 C60 106 38 86 6 96 Z" fill="${C.sky}" opacity=".6"/>
      <path d="M22 86 L36 86 M106 82 L122 82 M60 96 L72 96" stroke="${C.w}" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>
      ${leaf(24, 76, -12, C.s2)}${leaf(64, 84, 10, C.s3)}${leaf(106, 72, -6, C.sun, C.cream)}
      <circle cx="74" cy="66" r="2.6" fill="${C.w}"/><circle cx="80" cy="60" r="3.6" fill="${C.w}"/>
      ${cloud(78, 30, .45, C.w)}
      ${spark(40, 40, 5, C.sun)}`),

    // three sounds; the light rests on one at a time
    attention_training: () => svg(`<circle cx="104" cy="56" r="26" fill="${C.sun}" opacity=".2"/><circle cx="104" cy="56" r="17" fill="${C.sun}" opacity=".3"/>
      <path d="M126 40 Q132 48 126 56 M132 34 Q142 48 132 62" fill="none" stroke="${C.sun2}" stroke-width="2.5" stroke-linecap="round"/>
      ${[[44, 64, C.s2], [70, 38, C.lav2], [100, 52, C.s3]].map(([x, y, c]) =>
        `<circle cx="${x}" cy="${y + 14}" r="7" fill="${c}"/><line x1="${x + 5.5}" y1="${y + 14}" x2="${x + 5.5}" y2="${y - 6}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>
         <path d="M${x + 5.5} ${y - 6} Q${x + 14} ${y - 2} ${x + 13} ${y + 6}" fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"/>`).join("")}
      ${shadow(80, 36, 102)}`),
  };

  // 24px line icons for the "what is on your mind" replies, one meaning each
  const G = p => `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  const GLYPH = {
    loop: G('<path d="M20 12a8 8 0 1 1-2.34-5.66"/><path d="M20 4v4h-4"/>'),
    sting: G('<path d="M13 3 5 14h6l-1 7 8-11h-6Z"/>'),
    empty: G('<rect x="2.5" y="7.5" width="17" height="9" rx="2"/><path d="M22 11v2"/><path d="M6 11v2"/>'),
    avoid: G('<path d="M5 21V4h10v17"/><path d="M2 21h20"/><path d="M11 12h.01"/><path d="M15 4l4 2v15"/>'),
    unsure: G('<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>'),
  };

  const root = typeof window !== "undefined" ? window : globalThis;
  root.ART = ART; root.GLYPH = GLYPH; root.ART_COLORS = C;
})();
