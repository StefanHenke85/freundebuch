const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Nicht eingeloggt.' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Keine ID angegeben.' });

  try {
    const { userId } = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET);
    const result = await sql`
      DELETE FROM freunde_eintraege
      WHERE id = ${id} AND besitzer_id = ${userId}
      RETURNING id
    `;
    if (result.rows.length === 0) return res.status(404).json({ error: 'Eintrag nicht gefunden.' });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
