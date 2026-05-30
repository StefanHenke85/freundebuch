-- Einmalig in Vercel Postgres ausführen

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  vorname VARCHAR(100),
  nachname VARCHAR(100),
  geburtsdatum DATE,
  adresse VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profil (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  wohnort VARCHAR(255),
  telefon VARCHAR(50),
  beschreibung TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fragen (
  id SERIAL PRIMARY KEY,
  frage TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS antworten (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  frage TEXT NOT NULL,
  antwort TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Fragen einfügen
INSERT INTO fragen (frage) VALUES
  ('Was ist dein Lieblingsessen?'),
  ('Was machst du am liebsten in deiner Freizeit?'),
  ('Welchen Film würdest du immer wieder schauen?'),
  ('Was ist dein größter Traum?'),
  ('Welches Tier würdest du gerne sein?'),
  ('Was war dein schönstes Erlebnis?'),
  ('Welche Musik hörst du am liebsten?'),
  ('Wo würdest du am liebsten leben?'),
  ('Was ist deine Lieblingsfarbe?'),
  ('Was kannst du besonders gut?'),
  ('Was macht dich glücklich?'),
  ('Welchen Beruf hättest du gerne?'),
  ('Was war dein lustigster Moment?'),
  ('Welcher Superheld wärst du gerne?'),
  ('Was ist dein Lieblingsschulfach?'),
  ('Welche Jahreszeit magst du am liebsten?'),
  ('Was ist dein Lieblingsgetränk?'),
  ('Welches Buch hat dich beeindruckt?'),
  ('Was würdest du mit 1 Million Euro machen?'),
  ('Welchen Prominenten würdest du gerne treffen?'),
  ('Was ist deine peinlichste Erinnerung?'),
  ('Welches Hobby wolltest du immer ausprobieren?'),
  ('Was war das schwierigste in deinem Leben?'),
  ('Welcher Song beschreibt dich am besten?'),
  ('Was ist das Lustigste, das dir passiert ist?'),
  ('Welche App nutzt du am meisten?'),
  ('Welcher TikTok-Trend ist dein Favorit?'),
  ('Was fehlt dir aus deiner Kindheit am meisten?'),
  ('Was ist dein peinlichstes Foto?'),
  ('Wenn du für einen Tag das Gegenteil deines Geschlechts wärst, was würdest du tun?')
ON CONFLICT DO NOTHING;
