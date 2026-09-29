ALTER TABLE users
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS is_confirmed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS confirmation_code_hash TEXT,
  ADD COLUMN IF NOT EXISTS confirmation_expires_at TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique_idx ON users (lower(email));

-- Make existing users confirmed and allow NULL password_hash for new/unconfirmed users
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;

-- Mark pre-existing users (those with a password hash) as confirmed so they can continue logging in
UPDATE users SET is_confirmed = true WHERE password_hash IS NOT NULL;
