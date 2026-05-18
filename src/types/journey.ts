// types/journey.ts
// Re-exports all legacy journey types from the journey/ directory.
// This file exists only so that @/src/types/journey resolves correctly
// when both src/types/journey.ts and src/types/journey/ exist.
// New v5 types live in src/types/journeyV5.ts.

export * from "./journey/enums";
export * from "./journey/node";
export * from "./journey/unit";
export * from "./journey/state";
export * from "./journey/template";
export * from "./journey/progress";
export * from "./journey/config";
export * from "./journey/sectionMap";
export * from "./journey/enrollment";
export * from "./journey/mentalHealth";
