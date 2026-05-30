const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Nicht eingeloggt.' });

  const { linkId } = req.query;
  if (!linkId) return res.status(400).json({ error: 'Kein Event angegeben.' });

  try {
    const { userId } = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET);

    const link = await sql`
      SELECT id, event_typ, event_name, event_datum FROM share_links
      WHERE id = ${linkId} AND user_id = ${userId}
    `;
    if (link.rows.length === 0) return res.status(404).json({ error: 'Event nicht gefunden.' });

    const gaeste = await sql`
      SELECT id, freund_name, freund_email, antworten, foto, created_at
      FROM freunde_eintraege
      WHERE link_id = ${linkId}
      ORDER BY created_at DESC
    `;

    return res.status(200).json({ event: link.rows[0], gaeste: gaeste.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
