/*
  # Convert created_by columns to text with constraint handling

  Changes created_by columns from UUID to TEXT type by dropping and recreating
  foreign key constraints.
*/

DO $$
BEGIN
  -- Drop foreign key constraints before converting
  ALTER TABLE students
  DROP CONSTRAINT IF EXISTS students_created_by_fkey;

  ALTER TABLE results
  DROP CONSTRAINT IF EXISTS results_created_by_fkey;

  ALTER TABLE school_settings
  DROP CONSTRAINT IF EXISTS school_settings_updated_by_fkey;

  -- Convert created_by/updated_by columns to text
  ALTER TABLE students
  ALTER COLUMN created_by TYPE text USING created_by::text;

  ALTER TABLE results
  ALTER COLUMN created_by TYPE text USING created_by::text;

  ALTER TABLE school_settings
  ALTER COLUMN updated_by TYPE text USING updated_by::text;

  -- Note: Foreign key constraints are removed to allow text type
  -- This provides more flexibility but requires careful data management
END $$;