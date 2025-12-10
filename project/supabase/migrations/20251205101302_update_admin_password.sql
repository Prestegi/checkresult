/*
  # Update Default Admin Password

  This migration updates the default admin account password to use plain text
  for simplified authentication (for demo purposes only).

  ## Changes
  - Updates the password for the default admin account
  - Password: admin123

  ## Important Notes
  - In production, passwords should always be properly hashed
  - This is a simplified approach for demo and development purposes
*/

UPDATE admins 
SET password_hash = 'admin123' 
WHERE email = 'admin@school.com';