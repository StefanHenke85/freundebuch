-- In Vercel Postgres Query ausführen

CREATE TABLE IF NOT EXISTS freunde_eintraege (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  besitzer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  freund_name VARCHAR(255) NOT NULL,
  freund_email VARCHAR(255),
  antworten JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- share_links erweitern damit sie mehrfach nutzbar sind
ALTER TABLE share_links ADD COLUMN IF NOT EXISTS max_uses INTEGER DEFAULT 100;
ALTER TABLE share_links ALTER COLUMN used SET DEFAULT FALSE;
ALTER TABLE freunde_eintraege ADD COLUMN IF NOT EXISTS foto TEXT;
