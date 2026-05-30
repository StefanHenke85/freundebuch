const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, token, password } = req.body;
  if (!email || !token || !password) return res.status(400).json({ error: 'Alle Felder erforderlich.' });
  if (password.length < 6) return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein.' });

  try {
    const reset = await sql`
      SELECT r.token, r.expires_at, u.id, u.username, u.email, u.vorname, u.nachname
      FROM password_resets r
      JOIN users u ON u.id = r.user_id
      WHERE u.email = ${email} AND r.token = ${token.toUpperCase()}
    `;

    if (reset.rows.length === 0) return res.status(400).json({ error: 'Ungültiger Code.' });
    if (new Date(reset.rows[0].expires_at) < new Date()) return res.status(400).json({ error: 'Code abgelaufen. Bitte neu anfordern.' });

    const password_hash = await bcrypt.hash(password, 10);
    const user = reset.rows[0];

    await sql`UPDATE users SET password_hash = ${password_hash} WHERE id = ${user.id}`;
    await sql`DELETE FROM password_resets WHERE user_id = ${user.id}`;

    const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const { token: _, expires_at, ...userData } = user;
    return res.status(200).json({ token: authToken, user: userData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
