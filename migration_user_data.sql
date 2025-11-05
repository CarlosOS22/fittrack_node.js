-- Migración para actualizar la tabla user_data con todos los campos necesarios

USE fittrack;

-- Agregar nuevas columnas a la tabla user_data
ALTER TABLE user_data
ADD COLUMN IF NOT EXISTS currentWeight DECIMAL(5,2) AFTER user_id,
ADD COLUMN IF NOT EXISTS targetWeight DECIMAL(5,2) AFTER goal_weight,
ADD COLUMN IF NOT EXISTS timeframeWeeks INT AFTER targetWeight,
ADD COLUMN IF NOT EXISTS goal VARCHAR(20) DEFAULT 'maintain' AFTER timeframeWeeks,
ADD COLUMN IF NOT EXISTS tdee INT AFTER goal,
ADD COLUMN IF NOT EXISTS dailyCalories INT AFTER tdee,
ADD COLUMN IF NOT EXISTS macros JSON AFTER dailyCalories;

-- Migrar datos existentes de weight a currentWeight
UPDATE user_data SET currentWeight = weight WHERE currentWeight IS NULL AND weight IS NOT NULL;

-- Migrar datos existentes de goal_weight a targetWeight
UPDATE user_data SET targetWeight = goal_weight WHERE targetWeight IS NULL AND goal_weight IS NOT NULL;

-- Establecer valores por defecto para timeframeWeeks si es NULL
UPDATE user_data SET timeframeWeeks = 12 WHERE timeframeWeeks IS NULL;

SELECT 'Migración completada exitosamente' AS mensaje;
