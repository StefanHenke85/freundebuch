const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
  const { linkId } = req.query;
  if (!linkId) return res.status(400).json({ error: 'Kein Link angegeben.' });

  // GET: Infos zum Link laden (Name des Besitzers + bisherige Einträge)
  if (req.method === 'GET') {
    try {
      const link = await sql`
        SELECT s.id, s.user_id, u.vorname, u.nachname
        FROM share_links s
        JOIN users u ON u.id = s.user_id
        WHERE s.id = ${linkId}
      `;
      if (link.rows.length === 0) return res.status(404).json({ error: 'Link nicht gefunden.' });

      const { vorname, nachname, user_id } = link.rows[0];

      const eintraege = await sql`
        SELECT freund_name, antworten, foto, created_at
        FROM freunde_eintraege
        WHERE besitzer_id = ${user_id}
        ORDER BY created_at DESC
      `;

      const fragen = await sql`SELECT frage FROM fragen ORDER BY id`;

      return res.status(200).json({
        besitzer: `${vorname} ${nachname}`,
        besitzer_id: user_id,
        fragen: fragen.rows.map(f => f.frage),
        eintraege: eintraege.rows,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Serverfehler' });
    }
  }

  // POST: Eintrag speichern
  if (req.method === 'POST') {
    const { freund_name, freund_email, antworten, foto } = req.body;
    if (!freund_name || !antworten) return res.status(400).json({ error: 'Name und Antworten erforderlich.' });

    try {
      const link = await sql`SELECT user_id FROM share_links WHERE id = ${linkId}`;
      if (link.rows.length === 0) return res.status(404).json({ error: 'Link nicht gefunden.' });

      const { user_id } = link.rows[0];
      await sql`
        INSERT INTO freunde_eintraege (besitzer_id, freund_name, freund_email, antworten, foto)
        VALUES (${user_id}, ${freund_name}, ${freund_email || null}, ${JSON.stringify(antworten)}, ${foto || null})
      `;
      return res.status(201).json({ success: true });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Serverfehler' });
    }
  }

  return res.status(405).end();
};
