const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein.' });
  }

  // Username aus E-Mail ableiten + zufällige Zahl damit er unique ist
  const base = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const username = base + Math.floor(Math.random() * 9000 + 1000);

  const password_hash = await bcrypt.hash(password, 10);

  try {
    const result = await sql`
      INSERT INTO users (username, email, password_hash)
      VALUES (${username}, ${email}, ${password_hash})
      RETURNING id, username, email, vorname, nachname
    `;
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(201).json({ token, user });
  } catch (err) {
    if (err.message.includes('unique')) {
      return res.status(409).json({ error: 'Diese E-Mail ist bereits registriert.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
};
