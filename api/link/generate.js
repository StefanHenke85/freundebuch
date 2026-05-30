const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Nicht eingeloggt.' });

  let userId;
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), process.env.JWT_SECRET);
    userId = decoded.userId;
  } catch {
    return res.status(401).json({ error: 'Nicht eingeloggt.' });
  }

  const { event_typ = 'eigener', event_name, event_datum } = req.body || {};

  try {
    const result = await sql`
      INSERT INTO share_links (user_id, event_typ, event_name, event_datum)
      VALUES (${userId}, ${event_typ}, ${event_name || null}, ${event_datum || null})
      RETURNING id
    `;
    const linkId = result.rows[0].id;
    const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    return res.status(200).json({ link: `${base}/freund/${linkId}`, linkId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
