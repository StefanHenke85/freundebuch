-- In Vercel Postgres Query ausführen
ALTER TABLE share_links ADD COLUMN IF NOT EXISTS event_typ VARCHAR(50) DEFAULT 'eigener';
ALTER TABLE share_links ADD COLUMN IF NOT EXISTS event_name VARCHAR(255);
ALTER TABLE share_links ADD COLUMN IF NOT EXISTS event_datum DATE;
ALTER TABLE freunde_eintraege ADD COLUMN IF NOT EXISTS link_id UUID REFERENCES share_links(id) ON DELETE SET NULL;
