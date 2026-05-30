const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

async function register(req, res) {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
  if (password.length < 6) return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein.' });
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
    if (err.message.includes('unique')) return res.status(409).json({ error: 'Diese E-Mail ist bereits registriert.' });
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
}

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
  try {
    const result = await sql`
      SELECT id, username, email, vorname, nachname, geburtsdatum, adresse, password_hash
      FROM users WHERE username = ${username} OR email = ${username}
    `;
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    const { password_hash, ...userWithoutPassword } = user;
    return res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
}

async function forgot(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich.' });
  try {
    const user = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (user.rows.length === 0) return res.status(200).json({ message: 'ok' });
    const token = uuidv4().replace(/-/g, '').slice(0, 8).toUpperCase();
    const expires = new Date(Date.now() + 1000 * 60 * 30);
    await sql`
      INSERT INTO password_resets (user_id, token, expires_at)
      VALUES (${user.rows[0].id}, ${token}, ${expires.toISOString()})
      ON CONFLICT (user_id) DO UPDATE SET token = ${token}, expires_at = ${expires.toISOString()}
    `;
    return res.status(200).json({ token, message: 'Reset-Code erstellt.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
}

async function resetPassword(req, res) {
  const { email, token, password } = req.body;
  if (!email || !token || !password) return res.status(400).json({ error: 'Alle Felder erforderlich.' });
  if (password.length < 6) return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein.' });
  try {
    const reset = await sql`
      SELECT r.token, r.expires_at, u.id, u.username, u.email, u.vorname, u.nachname
      FROM password_resets r JOIN users u ON u.id = r.user_id
      WHERE u.email = ${email} AND r.token = ${token.toUpperCase()}
    `;
    if (reset.rows.length === 0) return res.status(400).json({ error: 'Ungültiger Code.' });
    if (new Date(reset.rows[0].expires_at) < new Date()) return res.status(400).json({ error: 'Code abgelaufen.' });
    const password_hash = await bcrypt.hash(password, 10);
    const user = reset.rows[0];
    await sql`UPDATE users SET password_hash = ${password_hash} WHERE id = ${user.id}`;
    await sql`DELETE FROM password_resets WHERE user_id = ${user.id}`;
    const authToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    return res.status(200).json({ token: authToken, user: { id: user.id, username: user.username, email: user.email, vorname: user.vorname, nachname: user.nachname } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
}

async function resetPw(req, res) {
  const { admin_key, email, new_password } = req.body;
  if (admin_key !== process.env.JWT_SECRET) return res.status(403).json({ error: 'Nicht erlaubt.' });
  const password_hash = await bcrypt.hash(new_password, 10);
  try {
    const result = await sql`UPDATE users SET password_hash = ${password_hash} WHERE email = ${email} RETURNING id, username, email`;
    if (result.rows.length === 0) return res.status(404).json({ error: 'User nicht gefunden.' });
    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Serverfehler' });
  }
}

module.exports = async function handler(req, res) {
  const action = req.query.action;
  if (req.method === 'POST') {
    if (action === 'register') return register(req, res);
    if (action === 'login') return login(req, res);
    if (action === 'forgot') return forgot(req, res);
    if (action === 'reset') return resetPassword(req, res);
    if (action === 'reset-pw') return resetPw(req, res);
  }
  return res.status(405).json({ error: 'Nicht gefunden.' });
};
