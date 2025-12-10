/*
  # Ensure UUID Defaults

  Verifies that all ID columns have proper UUID generation defaults.
*/

DO $$
BEGIN
  -- Ensure students table id has UUID default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'students' AND column_name = 'id'
  ) THEN
    ALTER TABLE students
    ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  -- Ensure admins table id has UUID default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins' AND column_name = 'id'
  ) THEN
    ALTER TABLE admins
    ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  -- Ensure results table id has UUID default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'results' AND column_name = 'id'
  ) THEN
    ALTER TABLE results
    ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  -- Ensure school_settings table id has UUID default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'school_settings' AND column_name = 'id'
  ) THEN
    ALTER TABLE school_settings
    ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;

  -- Ensure activity_logs table id has UUID default
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'activity_logs' AND column_name = 'id'
  ) THEN
    ALTER TABLE activity_logs
    ALTER COLUMN id SET DEFAULT gen_random_uuid();
  END IF;
END $$;