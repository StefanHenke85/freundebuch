const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try { return jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET).userId; }
  catch { return null; }
}

async function meineEvents(req, res) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Nicht eingeloggt.' });
  const links = await sql`
    SELECT s.id, s.event_typ, s.event_name, s.event_datum, s.created_at,
           COUNT(e.id)::int AS eintraege_anzahl
    FROM share_links s
    LEFT JOIN freunde_eintraege e ON e.link_id = s.id
    WHERE s.user_id = ${userId}
    GROUP BY s.id ORDER BY s.created_at DESC
  `;
  return res.status(200).json(links.rows);
}

async function eventGaeste(req, res) {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Nicht eingeloggt.' });
  const { linkId } = req.query;
  if (!linkId) return res.status(400).json({ error: 'Kein Event angegeben.' });
  const link = await sql`SELECT id, event_typ, event_name, event_datum FROM share_links WHERE id = ${linkId} AND user_id = ${userId}`;
  if (link.rows.length === 0) return res.status(404).json({ error: 'Event nicht gefunden.' });
  const gaeste = await sql`SELECT id, freund_name, freund_email, antworten, foto, created_at FROM freunde_eintraege WHERE link_id = ${linkId} ORDER BY created_at DESC`;
  return res.status(200).json({ event: link.rows[0], gaeste: gaeste.rows });
}

module.exports = async function handler(req, res) {
  const action = req.query.action;
  if (req.method === 'GET') {
    if (action === 'liste') return meineEvents(req, res);
    if (action === 'gaeste') return eventGaeste(req, res);
  }
  return res.status(405).end();
};
