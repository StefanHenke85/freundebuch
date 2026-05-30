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
  if (req.method !== 'GET') return res.status(405).end();

  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Nicht eingeloggt.' });

  try {
    const result = await sql`
      INSERT INTO share_links (user_id) VALUES (${userId}) RETURNING id
    `;
    const linkId = result.rows[0].id;
    const base = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';
    return res.status(200).json({ link: `${base}/freund/${linkId}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
