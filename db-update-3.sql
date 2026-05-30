-- In Vercel Postgres Query ausführen
CREATE TABLE IF NOT EXISTS password_resets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(20) NOT NULL,
  expires_at TIMESTAMP NOT NULL
);
