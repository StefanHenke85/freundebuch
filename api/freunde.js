const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Nicht eingeloggt.' });

  try {
    const { userId } = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET);
    const result = await sql`
      SELECT id, freund_name, freund_email, antworten, foto, created_at
      FROM freunde_eintraege
      WHERE besitzer_id = ${userId}
      ORDER BY created_at DESC
    `;
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
