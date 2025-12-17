/**
 * Dynamic Micronutrient Configuration
 * To add new micronutrients in the future:
 * 1. Add entry to MICRONUTRIENTS_CONFIG array
 * 2. Update AI prompt in calorieAi.ts to request the new nutrient
 * 3. No code changes needed elsewhere - everything is dynamic!
 */

export interface MicronutrientConfig {
  id: string; // Unique identifier (e.g., "zinc", "vitaminD3")
  name: string; // Display name (e.g., "Zinc", "Vitamin D3")
  unit: string; // Unit of measurement (mg, mcg, IU, etc.)
  dailyValue: number; // Recommended daily value
  category: "vitamin" | "mineral" | "other";
  description: string; // Brief description of benefits
}

/**
 * Complete micronutrient configuration
 * Add new entries here to extend tracking capabilities
 */
export const MICRONUTRIENTS_CONFIG: MicronutrientConfig[] = [
  // Vitamins
  {
    id: "vitaminD2",
    name: "Vitamin D2",
    unit: "mcg",
    dailyValue: 20,
    category: "vitamin",
    description: "Supports bone health and immune function",
  },
  {
    id: "vitaminD3",
    name: "Vitamin D3",
    unit: "mcg",
    dailyValue: 20,
    category: "vitamin",
    description: "Essential for calcium absorption",
  },
  {
    id: "vitaminC",
    name: "Vitamin C",
    unit: "mg",
    dailyValue: 90,
    category: "vitamin",
    description: "Antioxidant, supports immune system",
  },
  {
    id: "vitaminB12",
    name: "Vitamin B12",
    unit: "mcg",
    dailyValue: 2.4,
    category: "vitamin",
    description: "Energy production and brain function",
  },
  {
    id: "vitaminA",
    name: "Vitamin A",
    unit: "mcg",
    dailyValue: 900,
    category: "vitamin",
    description: "Vision health and immune support",
  },
  {
    id: "vitaminE",
    name: "Vitamin E",
    unit: "mg",
    dailyValue: 15,
    category: "vitamin",
    description: "Antioxidant protecting cells",
  },
  {
    id: "vitaminK",
    name: "Vitamin K",
    unit: "mcg",
    dailyValue: 120,
    category: "vitamin",
    description: "Blood clotting and bone health",
  },
  // Minerals
  {
    id: "zinc",
    name: "Zinc",
    unit: "mg",
    dailyValue: 11,
    category: "mineral",
    description: "Immune function and wound healing",
  },
  {
    id: "potassium",
    name: "Potassium",
    unit: "mg",
    dailyValue: 4700,
    category: "mineral",
    description: "Heart and muscle function",
  },
  {
    id: "iron",
    name: "Iron",
    unit: "mg",
    dailyValue: 18,
    category: "mineral",
    description: "Oxygen transport in blood",
  },
  {
    id: "calcium",
    name: "Calcium",
    unit: "mg",
    dailyValue: 1000,
    category: "mineral",
    description: "Bone and teeth strength",
  },
  {
    id: "magnesium",
    name: "Magnesium",
    unit: "mg",
    dailyValue: 400,
    category: "mineral",
    description: "Muscle and nerve function",
  },
];

/**
 * Get micronutrients by category
 */
export const getMicronutrientsByCategory = (
  category: "vitamin" | "mineral" | "other"
): MicronutrientConfig[] => {
  return MICRONUTRIENTS_CONFIG.filter((m) => m.category === category);
};

/**
 * Get a specific micronutrient by ID
 */
export const getMicronutrientById = (
  id: string
): MicronutrientConfig | undefined => {
  return MICRONUTRIENTS_CONFIG.find((m) => m.id === id);
};

/**
 * Get all micronutrient IDs for AI prompting
 */
export const getAllMicronutrientIds = (): string[] => {
  return MICRONUTRIENTS_CONFIG.map((m) => m.id);
};

/**
 * Get all micronutrient names for AI prompting
 */
export const getAllMicronutrientNames = (): string[] => {
  return MICRONUTRIENTS_CONFIG.map((m) => m.name);
};
