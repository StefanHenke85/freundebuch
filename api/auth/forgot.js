const { sql } = require('@vercel/postgres');
const { v4: uuidv4 } = require('uuid');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich.' });

  try {
    const user = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (user.rows.length === 0) {
      // Sicherheit: kein Hinweis ob E-Mail existiert
      return res.status(200).json({ message: 'ok' });
    }

    const token = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 Min

    await sql`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (${user.rows[0].id}, ${token}, ${expires.toISOString()})
      ON CONFLICT (user_id) DO UPDATE SET token = ${token}, expires_at = ${expires.toISOString()}
    `;

    // In Produktion: E-Mail senden. Hier: Token zurückgeben (für Demo)
    return res.status(200).json({ token, message: 'Reset-Code erstellt.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
