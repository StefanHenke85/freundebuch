import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './FreundEintrag.css';

const FreundEintrag = () => {
  const { linkId } = useParams();
  const [daten, setDaten] = useState(null);
  const [fehler, setFehler] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [antworten, setAntworten] = useState({});
  const [schritt, setSchritt] = useState('laden'); // laden | ausfuellen | danke
  const [aktiveSeite, setAktiveSeite] = useState(0);

  useEffect(() => {
    fetch(`/api/eintrag?linkId=${linkId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setFehler(d.error); setSchritt('fehler'); return; }
        setDaten(d);
        setSchritt('ausfuellen');
      })
      .catch(() => { setFehler('Verbindungsfehler.'); setSchritt('fehler'); });
  }, [linkId]);

  const handleSenden = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const antwortListe = daten.fragen.map(f => ({
      frage: f,
      antwort: antworten[f] || '',
    }));

    const res = await fetch(`/api/eintrag?linkId=${linkId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freund_name: name, freund_email: email, antworten: antwortListe }),
    });

    if (res.ok) setSchritt('danke');
    else setFehler('Fehler beim Speichern.');
  };

  if (schritt === 'laden') return <div className="fe-wrapper"><p className="fe-laden">Lade…</p></div>;
  if (schritt === 'fehler') return <div className="fe-wrapper"><p className="fe-fehler">{fehler}</p></div>;

  if (schritt === 'danke') return (
    <div className="fe-wrapper">
      <div className="fe-karte fe-danke">
        <h1 className="fe-titel">Danke! 🎉</h1>
        <p className="fe-text">Du bist jetzt im Freundebuch von <strong>{daten?.besitzer}</strong> eingetragen.</p>
        <p className="fe-text">Möchtest du auch ein eigenes Freundebuch erstellen?</p>
        <Link className="fe-btn" to="/register">Jetzt registrieren</Link>
      </div>
    </div>
  );

  const SEITE_GROESSE = 6;
  const seiten = daten ? Array.from({ length: Math.ceil((daten.fragen?.length || 0) / SEITE_GROESSE) },
    (_, i) => (daten.fragen || []).slice(i * SEITE_GROESSE, (i + 1) * SEITE_GROESSE)) : [];
  const letzteSeite = aktiveSeite === seiten.length;

  return (
    <div className="fe-wrapper">
      <div className="fe-buch">
        {/* Linke Seite: Infos */}
        <div className="fe-links">
          <h2 className="fe-buch-titel">Freundebuch</h2>
          <p className="fe-besitzer">von <strong>{daten.besitzer}</strong></p>

          {aktiveSeite === 0 && (
            <div className="fe-name-bereich">
              <p className="fe-hinweis">Trag deinen Namen ein und beantworte ein paar Fragen!</p>
              <label className="fe-label">
                Dein Name *
                <input className="fe-input" type="text" value={name}
                  onChange={e => setName(e.target.value)} placeholder="Wie heißt du?" required />
              </label>
              <label className="fe-label">
                Deine E-Mail (optional)
                <input className="fe-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="für Benachrichtigungen" />
              </label>
            </div>
          )}

          {/* Bisherige Einträge */}
          {daten.eintraege.length > 0 && (
            <div className="fe-eintraege">
              <p className="fe-eintraege-titel">Bereits eingetragen:</p>
              {daten.eintraege.slice(0, 5).map((e, i) => (
                <span key={i} className="fe-freund-chip">{e.freund_name}</span>
              ))}
              {daten.eintraege.length > 5 && <span className="fe-freund-chip">+{daten.eintraege.length - 5} weitere</span>}
            </div>
          )}
        </div>

        {/* Rechte Seite: Fragen */}
        <div className="fe-rechts">
          {!letzteSeite ? (
            <>
              <p className="fe-seite-nr">Seite {aktiveSeite + 1} / {seiten.length}</p>
              <form className="fe-fragen">
                {seiten[aktiveSeite].map((frage, i) => (
                  <label key={i} className="fe-frage-label">
                    <span className="fe-frage-text">{frage}</span>
                    <input className="fe-frage-input" type="text"
                      value={antworten[frage] || ''}
                      onChange={e => setAntworten({ ...antworten, [frage]: e.target.value })}
                      placeholder="Deine Antwort…" />
                  </label>
                ))}
                <button type="button" className="fe-btn" onClick={() => setAktiveSeite(aktiveSeite + 1)}>
                  Weiter →
                </button>
              </form>
            </>
          ) : (
            <form className="fe-abschluss" onSubmit={handleSenden}>
              <p className="fe-abschluss-text">Fast fertig! Klick auf "Eintragen" um dich in das Buch einzutragen.</p>
              {fehler && <p className="fe-fehler">{fehler}</p>}
              <div className="fe-abschluss-buttons">
                <button type="button" className="fe-btn fe-btn-grau" onClick={() => setAktiveSeite(aktiveSeite - 1)}>← Zurück</button>
                <button type="submit" className="fe-btn" disabled={!name.trim()}>📖 Eintragen</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreundEintrag;
