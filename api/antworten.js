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

  if (req.method === 'POST') {
    const { antworten } = req.body;
    if (!Array.isArray(antworten)) return res.status(400).json({ error: 'Ungültige Daten.' });

    try {
      await sql`DELETE FROM antworten WHERE user_id = ${userId}`;
      for (const a of antworten) {
        await sql`
          INSERT INTO antworten (user_id, frage, antwort)
          VALUES (${userId}, ${a.frage}, ${a.antwort})
        `;
      }
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Serverfehler' });
    }
  }

  if (req.method === 'GET') {
    try {
      const result = await sql`
        SELECT frage, antwort FROM antworten WHERE user_id = ${userId} ORDER BY id
      `;
      return res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Serverfehler' });
    }
  }

  return res.status(405).end();
};
