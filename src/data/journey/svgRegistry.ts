/**
 * SVG Asset Registry (Task 11)
 * Pure data registry mapping node variant icon keys to SVG XML strings.
 *
 * Components look up SVGs by key from NodeIconConfig.value.
 * Adding a new icon = adding one entry to this registry. Zero code changes.
 *
 * Each SVG is designed at 70x65 dp (matching NODE_SIZE.regular) with
 * a pill-shaped background and a centered icon glyph.
 * Color is baked into the SVG per status (locked/active/completed).
 */

// ---------------------------------------------------------------------------
// Registry type
// ---------------------------------------------------------------------------

/** SVG XML string keyed by icon config value */
export const SVG_REGISTRY: Record<string, string> = {
    // ======================================================================
    // STAR (lesson nodes)
    // ======================================================================

    star_locked: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_dd_4_5107)">
<rect width="70" height="57" rx="28.5" fill="#E5E5E5"/>
</g>
<path fill-rule="evenodd" clip-rule="evenodd" d="M34.8731 16.0382C30.9449 16.0382 27.7604 19.0241 27.7604 22.7073V24.983C27.7604 25.0386 27.7612 25.0941 27.7626 25.1493H27.7049C25.854 25.1493 24.3535 26.6498 24.3535 28.5007V37.4418C24.3535 39.2927 25.854 40.7932 27.7049 40.7932H42.0455C43.8965 40.7932 45.397 39.2927 45.397 37.4418V28.5008C45.397 26.6498 43.8965 25.1493 42.0455 25.1493H41.9837C41.9851 25.0941 41.9858 25.0386 41.9858 24.983V22.7073C41.9858 19.0241 38.8014 16.0382 34.8731 16.0382ZM38.4812 25.1493C38.484 25.0942 38.4855 25.0388 38.4855 24.983V22.7073C38.4855 20.8367 36.8682 19.3203 34.8731 19.3203C32.8781 19.3203 31.2608 20.8367 31.2608 22.7073V24.983C31.2608 25.0388 31.2622 25.0942 31.2651 25.1493H38.4812Z" fill="#AFAFAF"/>
<defs>
<filter id="filter0_dd_4_5107" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0.898039 0 0 0 0 0.898039 0 0 0 0 0.898039 0 0 0 1 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4_5107"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset dy="8"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_4_5107" result="shape"/>
</filter>
</defs>
</svg>`,

    star_active: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)">
<rect width="70" height="57" rx="28.5" fill="#58CC02"/>
</g>
<path d="M35 20l3.09 6.26L45 27.27l-5 4.87 1.18 6.88L35 35.77l-6.18 3.25L30 32.14l-5-4.87 6.91-1.01L35 20z" fill="#FFFFFF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/>
<feColorMatrix values="0 0 0 0 0.267 0 0 0 0 0.639 0 0 0 0 0.008 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/>
<feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    star_completed: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)">
<rect width="70" height="57" rx="28.5" fill="#FFC800"/>
</g>
<path d="M35 20l3.09 6.26L45 27.27l-5 4.87 1.18 6.88L35 35.77l-6.18 3.25L30 32.14l-5-4.87 6.91-1.01L35 20z" fill="#FFFFFF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/>
<feColorMatrix values="0 0 0 0 0.8 0 0 0 0 0.627 0 0 0 0 0 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/>
<feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    // ======================================================================
    // BOOK / CHECKPOINT
    // ======================================================================

    book_locked: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#E5E5E5"/></g>
<path d="M25 22h8v18h-8a2 2 0 01-2-2V24a2 2 0 012-2zm10 0h8a2 2 0 012 2v14a2 2 0 01-2 2h-8V22zm-1 0v18" stroke="#AFAFAF" stroke-width="2" fill="none"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    book_active: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#58CC02"/></g>
<path d="M25 22h8v18h-8a2 2 0 01-2-2V24a2 2 0 012-2zm10 0h8a2 2 0 012 2v14a2 2 0 01-2 2h-8V22zm-1 0v18" stroke="#FFFFFF" stroke-width="2" fill="none"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.267 0 0 0 0 0.639 0 0 0 0 0.008 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    checkmark_completed: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#FFC800"/></g>
<path d="M28 30l5 5 9-9" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.8 0 0 0 0 0.627 0 0 0 0 0 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    // ======================================================================
    // CHEST
    // ======================================================================

    chest_locked: `<svg width="80" height="75" viewBox="0 0 80 75" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect x="5" width="70" height="60" rx="12" fill="#A0AEC0"/></g>
<rect x="20" y="15" width="40" height="28" rx="4" fill="#718096"/>
<rect x="35" y="20" width="10" height="10" rx="5" fill="#A0AEC0"/>
<rect x="20" y="30" width="40" height="3" fill="#5A6B7F"/>
<defs><filter id="f" x="0" y="0" width="80" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0 0.6 0 0 0 0.5 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    chest_active: `<svg width="80" height="75" viewBox="0 0 80 75" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect x="5" width="70" height="60" rx="12" fill="#8B5E3C"/></g>
<rect x="20" y="15" width="40" height="28" rx="4" fill="#6B4226"/>
<rect x="35" y="20" width="10" height="10" rx="5" fill="#FFD700"/>
<rect x="20" y="30" width="40" height="3" fill="#5A3A1A"/>
<defs><filter id="f" x="0" y="0" width="80" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.1 0 0 0 0.5 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    chest_completed: `<svg width="80" height="75" viewBox="0 0 80 75" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect x="5" width="70" height="60" rx="12" fill="#8B5E3C"/></g>
<rect x="20" y="15" width="40" height="28" rx="4" fill="#6B4226"/>
<rect x="35" y="20" width="10" height="10" rx="5" fill="#FFD700"/>
<rect x="20" y="30" width="40" height="3" fill="#5A3A1A"/>
<path d="M33 32l5 5 9-9" stroke="#FFD700" stroke-width="2.5" stroke-linecap="round" fill="none"/>
<defs><filter id="f" x="0" y="0" width="80" height="75" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0 0.1 0 0 0 0.5 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    // ======================================================================
    // MICROPHONE (voice exercises)
    // ======================================================================

    microphone_locked: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#E5E5E5"/></g>
<rect x="31" y="18" width="8" height="14" rx="4" fill="#AFAFAF"/>
<path d="M28 30a7 7 0 0014 0" stroke="#AFAFAF" stroke-width="2" fill="none" stroke-linecap="round"/>
<line x1="35" y1="37" x2="35" y2="42" stroke="#AFAFAF" stroke-width="2" stroke-linecap="round"/>
<line x1="30" y1="42" x2="40" y2="42" stroke="#AFAFAF" stroke-width="2" stroke-linecap="round"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    microphone_active: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#58CC02"/></g>
<rect x="31" y="18" width="8" height="14" rx="4" fill="#FFFFFF"/>
<path d="M28 30a7 7 0 0014 0" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
<line x1="35" y1="37" x2="35" y2="42" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
<line x1="30" y1="42" x2="40" y2="42" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.267 0 0 0 0 0.639 0 0 0 0 0.008 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    microphone_completed: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#FFC800"/></g>
<rect x="31" y="18" width="8" height="14" rx="4" fill="#FFFFFF"/>
<path d="M28 30a7 7 0 0014 0" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
<line x1="35" y1="37" x2="35" y2="42" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
<line x1="30" y1="42" x2="40" y2="42" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.8 0 0 0 0 0.627 0 0 0 0 0 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    // ======================================================================
    // VIDEO (video exercises)
    // ======================================================================

    video_locked: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#E5E5E5"/></g>
<rect x="22" y="22" width="20" height="14" rx="3" fill="#AFAFAF"/>
<path d="M44 25l6-3v14l-6-3V25z" fill="#AFAFAF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    video_active: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#58CC02"/></g>
<rect x="22" y="22" width="20" height="14" rx="3" fill="#FFFFFF"/>
<path d="M44 25l6-3v14l-6-3V25z" fill="#FFFFFF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.267 0 0 0 0 0.639 0 0 0 0 0.008 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    video_completed: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#FFC800"/></g>
<rect x="22" y="22" width="20" height="14" rx="3" fill="#FFFFFF"/>
<path d="M44 25l6-3v14l-6-3V25z" fill="#FFFFFF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.8 0 0 0 0 0.627 0 0 0 0 0 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    // ======================================================================
    // GAMEPAD (interactive exercises)
    // ======================================================================

    gamepad_locked: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#E5E5E5"/></g>
<path d="M24 26a4 4 0 014-4h14a4 4 0 014 4v6a10 10 0 01-22 0v-6z" fill="#AFAFAF"/>
<circle cx="30" cy="28" r="2" fill="#E5E5E5"/><circle cx="40" cy="28" r="2" fill="#E5E5E5"/>
<rect x="33" y="25" width="4" height="2" rx="1" fill="#E5E5E5"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    gamepad_active: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#58CC02"/></g>
<path d="M24 26a4 4 0 014-4h14a4 4 0 014 4v6a10 10 0 01-22 0v-6z" fill="#FFFFFF"/>
<circle cx="30" cy="28" r="2" fill="#58CC02"/><circle cx="40" cy="28" r="2" fill="#58CC02"/>
<rect x="33" y="25" width="4" height="2" rx="1" fill="#58CC02"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.267 0 0 0 0 0.639 0 0 0 0 0.008 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    gamepad_completed: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#FFC800"/></g>
<path d="M24 26a4 4 0 014-4h14a4 4 0 014 4v6a10 10 0 01-22 0v-6z" fill="#FFFFFF"/>
<circle cx="30" cy="28" r="2" fill="#FFC800"/><circle cx="40" cy="28" r="2" fill="#FFC800"/>
<rect x="33" y="25" width="4" height="2" rx="1" fill="#FFC800"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.8 0 0 0 0 0.627 0 0 0 0 0 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    // ======================================================================
    // HEADPHONES (listening exercises)
    // ======================================================================

    headphones_locked: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#E5E5E5"/></g>
<path d="M24 32a11 11 0 0122 0" stroke="#AFAFAF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<rect x="22" y="31" width="6" height="10" rx="3" fill="#AFAFAF"/>
<rect x="42" y="31" width="6" height="10" rx="3" fill="#AFAFAF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 0 0.898 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    headphones_active: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#58CC02"/></g>
<path d="M24 32a11 11 0 0122 0" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<rect x="22" y="31" width="6" height="10" rx="3" fill="#FFFFFF"/>
<rect x="42" y="31" width="6" height="10" rx="3" fill="#FFFFFF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.267 0 0 0 0 0.639 0 0 0 0 0.008 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,

    headphones_completed: `<svg width="70" height="65" viewBox="0 0 70 65" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#f)"><rect width="70" height="57" rx="28.5" fill="#FFC800"/></g>
<path d="M24 32a11 11 0 0122 0" stroke="#FFFFFF" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<rect x="22" y="31" width="6" height="10" rx="3" fill="#FFFFFF"/>
<rect x="42" y="31" width="6" height="10" rx="3" fill="#FFFFFF"/>
<defs><filter id="f" x="0" y="0" width="70" height="65" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="bg"/><feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="a"/>
<feOffset dy="8"/><feComposite in2="a" operator="out"/><feColorMatrix values="0 0 0 0 0.8 0 0 0 0 0.627 0 0 0 0 0 0 0 0 1 0"/>
<feBlend in2="bg" result="s1"/><feBlend in="SourceGraphic" in2="s1" result="shape"/>
</filter></defs></svg>`,
};

/**
 * Look up an SVG by key. Returns undefined if not found.
 * This is the ONLY function components call to get SVG content.
 */
export function getSvg(key: string): string | undefined {
    return SVG_REGISTRY[key];
}
