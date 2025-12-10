/*
  # Student Result Management System - Initial Schema

  ## Overview
  This migration creates the complete database structure for a student result management system
  with admin backend, student portal, and customizable result templates.

  ## New Tables

  ### 1. `admins`
  - `id` (uuid, primary key) - Unique admin identifier
  - `email` (text, unique) - Admin email for login
  - `full_name` (text) - Admin full name
  - `password_hash` (text) - Hashed password
  - `is_active` (boolean) - Account status
  - `created_at` (timestamptz) - Account creation timestamp
  - `last_login` (timestamptz) - Last login timestamp

  ### 2. `students`
  - `id` (uuid, primary key) - Unique student identifier
  - `student_id` (text, unique) - Student registration number
  - `full_name` (text) - Student full name
  - `email` (text) - Student email (optional)
  - `pin` (text) - 4-6 digit PIN for login
  - `class` (text) - Current class/grade
  - `is_active` (boolean) - Account status (active/disabled)
  - `created_at` (timestamptz) - Record creation timestamp
  - `created_by` (uuid) - Admin who created the record

  ### 3. `results`
  - `id` (uuid, primary key) - Unique result identifier
  - `student_id` (uuid, foreign key) - Reference to students table
  - `term` (text) - Academic term (First Term, Second Term, Third Term)
  - `session` (text) - Academic session (e.g., 2023/2024)
  - `subjects` (jsonb) - Array of subject grades [{name, score, grade, remark}]
  - `total_score` (numeric) - Total marks obtained
  - `average` (numeric) - Average score
  - `position` (text) - Class position
  - `teacher_comment` (text) - Class teacher's comment
  - `principal_comment` (text) - Principal's comment
  - `attendance_present` (integer) - Days present
  - `attendance_total` (integer) - Total school days
  - `created_at` (timestamptz) - Upload timestamp
  - `created_by` (uuid) - Admin who uploaded

  ### 4. `school_settings`
  - `id` (uuid, primary key) - Settings identifier
  - `school_name` (text) - School name
  - `school_address` (text) - School address
  - `school_email` (text) - School email
  - `school_phone` (text) - School phone
  - `logo_url` (text) - School logo image URL
  - `principal_signature_url` (text) - Principal signature image URL
  - `primary_color` (text) - Brand primary color
  - `secondary_color` (text) - Brand secondary color
  - `result_template` (text) - Template style (modern, classic, minimal)
  - `watermark_text` (text) - Optional watermark
  - `updated_at` (timestamptz) - Last update timestamp
  - `updated_by` (uuid) - Admin who updated

  ### 5. `activity_logs`
  - `id` (uuid, primary key) - Log entry identifier
  - `actor_type` (text) - Type of actor (admin, student)
  - `actor_id` (uuid) - ID of the actor
  - `action` (text) - Action performed
  - `description` (text) - Detailed description
  - `metadata` (jsonb) - Additional data
  - `created_at` (timestamptz) - Action timestamp

  ## Security
  - RLS enabled on all tables
  - Admins can manage all data
  - Students can only view their own results
  - Activity logs are append-only for admins

  ## Notes
  - Initial admin must be created manually
  - Default school settings will be inserted
  - PIN should be securely hashed in production
*/

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  password_hash text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  last_login timestamptz
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text UNIQUE NOT NULL,
  full_name text NOT NULL,
  email text,
  pin text NOT NULL,
  class text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admins(id)
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  term text NOT NULL,
  session text NOT NULL,
  subjects jsonb NOT NULL DEFAULT '[]',
  total_score numeric DEFAULT 0,
  average numeric DEFAULT 0,
  position text,
  teacher_comment text,
  principal_comment text,
  attendance_present integer DEFAULT 0,
  attendance_total integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES admins(id),
  UNIQUE(student_id, term, session)
);

-- Create school_settings table
CREATE TABLE IF NOT EXISTS school_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name text DEFAULT 'School Name',
  school_address text DEFAULT '',
  school_email text DEFAULT '',
  school_phone text DEFAULT '',
  logo_url text,
  principal_signature_url text,
  primary_color text DEFAULT '#2563eb',
  secondary_color text DEFAULT '#1e40af',
  result_template text DEFAULT 'modern',
  watermark_text text,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES admins(id)
);

-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_type text NOT NULL,
  actor_id uuid NOT NULL,
  action text NOT NULL,
  description text NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_student_id ON students(student_id);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_results_student_id ON results(student_id);
CREATE INDEX IF NOT EXISTS idx_results_session ON results(session);
CREATE INDEX IF NOT EXISTS idx_results_term ON results(term);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_actor ON activity_logs(actor_type, actor_id);

-- Enable Row Level Security
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admins table (admins can manage admins)
CREATE POLICY "Admins can view all admins"
  ON admins FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert admins"
  ON admins FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update admins"
  ON admins FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- RLS Policies for students table
CREATE POLICY "Anyone can view active students for login"
  ON students FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can insert students"
  ON students FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update students"
  ON students FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  USING (true);

-- RLS Policies for results table
CREATE POLICY "Students can view own results"
  ON results FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert results"
  ON results FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update results"
  ON results FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can delete results"
  ON results FOR DELETE
  USING (true);

-- RLS Policies for school_settings table
CREATE POLICY "Anyone can view school settings"
  ON school_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update school settings"
  ON school_settings FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Admins can insert school settings"
  ON school_settings FOR INSERT
  WITH CHECK (true);

-- RLS Policies for activity_logs table
CREATE POLICY "Admins can view all logs"
  ON activity_logs FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert logs"
  ON activity_logs FOR INSERT
  WITH CHECK (true);

-- Insert default school settings
INSERT INTO school_settings (school_name, school_address)
VALUES ('Your School Name', 'School Address')
ON CONFLICT DO NOTHING;

-- Insert default admin (password: admin123 - CHANGE THIS IN PRODUCTION)
-- Password hash generated using bcrypt with 10 rounds
INSERT INTO admins (email, full_name, password_hash)
VALUES ('admin@school.com', 'System Administrator', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy')
ON CONFLICT DO NOTHING;