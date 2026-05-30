const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { admin_key, email, new_password } = req.body;

  if (admin_key !== process.env.JWT_SECRET) {
    return res.status(403).json({ error: 'Nicht erlaubt.' });
  }

  const password_hash = await bcrypt.hash(new_password, 10);

  try {
    const result = await sql`
      UPDATE users SET password_hash = ${password_hash}
      WHERE email = ${email}
      RETURNING id, username, email
    `;
    if (result.rows.length === 0) return res.status(404).json({ error: 'User nicht gefunden.' });
    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
