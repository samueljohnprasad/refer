-- Add micronutrient tracking columns to calorie_entries table

-- Add total_micronutrients column to store aggregated micronutrients
ALTER TABLE calorie_entries 
ADD COLUMN IF NOT EXISTS total_micronutrients jsonb;

-- Add comment to explain the column structure
COMMENT ON COLUMN calorie_entries.total_micronutrients IS 
'Stores aggregated micronutrients for the meal in JSON format.
Dynamic key-value structure allows adding new micronutrients without schema changes.
Example structure: {
  "zinc": 11.5,
  "potassium": 450.2,
  "vitaminD2": 2.1,
  "vitaminD3": 15.3,
  "vitaminC": 75.8,
  "vitaminB12": 2.4,
  "iron": 8.2,
  "calcium": 650.0,
  "magnesium": 320.5,
  "vitaminA": 800.0,
  "vitaminE": 12.5,
  "vitaminK": 90.0,
  ... any future micronutrients can be added
}';

-- Optional: Add an index for querying micronutrients
CREATE INDEX IF NOT EXISTS idx_calorie_entries_micronutrients 
ON calorie_entries USING gin (total_micronutrients);
