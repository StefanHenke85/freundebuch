const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Nicht eingeloggt.' });

  try {
    const { userId } = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET);

    const links = await sql`
      SELECT s.id, s.event_typ, s.event_name, s.event_datum, s.created_at,
             COUNT(e.id)::int AS eintraege_anzahl
      FROM share_links s
      LEFT JOIN freunde_eintraege e ON e.link_id = s.id
      WHERE s.user_id = ${userId}
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `;

    return res.status(200).json(links.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
