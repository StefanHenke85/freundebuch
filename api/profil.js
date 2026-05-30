const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.userId;
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Nicht eingeloggt.' });

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT u.username, u.vorname, u.nachname, u.email, u.geburtsdatum, u.adresse,
               p.wohnort, p.telefon, p.beschreibung
        FROM users u
        LEFT JOIN profil p ON p.user_id = u.id
        WHERE u.id = ${userId}
      `;
      return res.status(200).json(result.rows[0] || {});
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Serverfehler' });
    }
  }

  if (req.method === 'POST') {
    const { wohnort, telefon, beschreibung, geburtsdatum, adresse } = req.body;
    try {
      await sql`
        INSERT INTO profil (user_id, wohnort, telefon, beschreibung, updated_at)
        VALUES (${userId}, ${wohnort}, ${telefon}, ${beschreibung}, NOW())
        ON CONFLICT (user_id) DO UPDATE
          SET wohnort = ${wohnort}, telefon = ${telefon},
              beschreibung = ${beschreibung}, updated_at = NOW()
      `;
      if (geburtsdatum !== undefined || adresse !== undefined) {
        await sql`
          UPDATE users SET
            geburtsdatum = COALESCE(${geburtsdatum || null}::date, geburtsdatum),
            adresse = COALESCE(${adresse || null}, adresse)
          WHERE id = ${userId}
        `;
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Serverfehler' });
    }
  }

  return res.status(405).end();
};
