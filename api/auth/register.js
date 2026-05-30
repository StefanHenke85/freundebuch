const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { username, email, password, vorname, nachname, geburtsdatum, adresse } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Benutzername, E-Mail und Passwort sind erforderlich.' });
  }

  const password_hash = await bcrypt.hash(password, 10);

  try {
    const result = await sql`
      INSERT INTO users (username, email, password_hash, vorname, nachname, geburtsdatum, adresse)
      VALUES (${username}, ${email}, ${password_hash}, ${vorname}, ${nachname}, ${geburtsdatum || null}, ${adresse})
      RETURNING id, username, email, vorname, nachname
    `;
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({ token, user });
  } catch (err) {
    if (err.message.includes('unique')) {
      return res.status(409).json({ error: 'Benutzername oder E-Mail bereits vergeben.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
