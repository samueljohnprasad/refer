/**
 * Mascot Image Registry
 * Maps mascot imageKey values from SectionConfig to SVG XML strings.
 *
 * Components look up mascots by key — no hardcoded SVGs in components.
 * Adding a new mascot pose = adding one entry here. Zero code changes.
 */

/** Mascot SVG XML strings keyed by imageKey from SectionMascotConfig */
export const MASCOT_REGISTRY: Record<string, string> = {
    owl_default: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="40" cy="40" r="36" fill="#78C800"/>
<circle cx="40" cy="40" r="30" fill="#58CC02"/>
<ellipse cx="30" cy="34" rx="10" ry="12" fill="white"/>
<ellipse cx="50" cy="34" rx="10" ry="12" fill="white"/>
<circle cx="32" cy="34" r="5" fill="#1A1A2E"/>
<circle cx="48" cy="34" r="5" fill="#1A1A2E"/>
<circle cx="34" cy="32" r="2" fill="white"/>
<circle cx="50" cy="32" r="2" fill="white"/>
<path d="M36 50 Q40 56 44 50" stroke="#FFC800" stroke-width="3" stroke-linecap="round" fill="none"/>
<path d="M35 44 L40 48 L45 44" fill="#FFC800"/>
<ellipse cx="22" cy="42" rx="4" ry="8" fill="#46A302" transform="rotate(-15 22 42)"/>
<ellipse cx="58" cy="42" rx="4" ry="8" fill="#46A302" transform="rotate(15 58 42)"/>
<path d="M28 18 Q32 8 36 16" fill="#78C800"/>
<path d="M44 16 Q48 8 52 18" fill="#78C800"/>
</svg>`,

    owl_excited: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="40" cy="40" r="36" fill="#CE82FF"/>
<circle cx="40" cy="40" r="30" fill="#A855F7"/>
<ellipse cx="30" cy="34" rx="11" ry="13" fill="white"/>
<ellipse cx="50" cy="34" rx="11" ry="13" fill="white"/>
<circle cx="32" cy="33" r="6" fill="#1A1A2E"/>
<circle cx="48" cy="33" r="6" fill="#1A1A2E"/>
<circle cx="34" cy="31" r="2.5" fill="white"/>
<circle cx="50" cy="31" r="2.5" fill="white"/>
<path d="M34 50 Q40 58 46 50" stroke="#FFC800" stroke-width="3" stroke-linecap="round" fill="none"/>
<path d="M35 44 L40 49 L45 44" fill="#FFC800"/>
<ellipse cx="20" cy="38" rx="5" ry="9" fill="#9333EA" transform="rotate(-25 20 38)"/>
<ellipse cx="60" cy="38" rx="5" ry="9" fill="#9333EA" transform="rotate(25 60 38)"/>
<path d="M26 16 Q30 4 34 14" fill="#CE82FF"/>
<path d="M46 14 Q50 4 54 16" fill="#CE82FF"/>
<text x="8" y="20" font-size="14">⭐</text>
<text x="62" y="20" font-size="14">⭐</text>
</svg>`,
};

/**
 * Look up a mascot SVG by imageKey.
 * Returns undefined if key not found.
 */
export function getMascotSvg(imageKey: string): string | undefined {
    return MASCOT_REGISTRY[imageKey];
}
