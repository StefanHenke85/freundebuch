import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "../Profil/Profil-Design.css";

const FreundebuchSeite = ({ seite, vonIndex, bisIndex, cssId, vorSeite, nachSeite, fragen: fragenProp }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [fragen, setFragen] = useState(fragenProp || []);
  const [antworten, setAntworten] = useState([]);
  const [gespeichert, setGespeichert] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (fragenProp) return;

    const cached = sessionStorage.getItem('fb_fragen');
    if (cached) { setFragen(JSON.parse(cached)); return; }

    fetch('/api/fragen')
      .then(r => r.json())
      .then(data => {
        sessionStorage.setItem('fb_fragen', JSON.stringify(data));
        setFragen(data);
      })
      .catch(console.error);
  }, [token, navigate, fragenProp]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/antworten', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const slice = fragenProp
          ? fragenProp.map(f => { const found = data.find(a => a.frage === f); return found ? found.antwort : ''; })
          : fragen.slice(vonIndex, bisIndex).map(f => { const found = data.find(a => a.frage === f.frage); return found ? found.antwort : ''; });
        setAntworten(slice);
      })
      .catch(console.error);
  }, [token, fragen, vonIndex, bisIndex, fragenProp]);

  const aktiveFragen = fragenProp
    ? fragenProp.map((f, i) => ({ frage: f, index: i }))
    : fragen.slice(vonIndex, bisIndex).map((f, i) => ({ frage: f.frage, index: i }));

  const handleSave = useCallback(async () => {
    if (!token) return;
    const alle = JSON.parse(sessionStorage.getItem('fb_antworten') || '[]');
    aktiveFragen.forEach(({ frage, index }) => {
      const existing = alle.findIndex(a => a.frage === frage);
      if (existing >= 0) alle[existing].antwort = antworten[index] || '';
      else alle.push({ frage, antwort: antworten[index] || '' });
    });
    sessionStorage.setItem('fb_antworten', JSON.stringify(alle));

    try {
      await fetch('/api/antworten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ antworten: alle }),
      });
      setGespeichert(true);
      setTimeout(() => setGespeichert(false), 2000);
    } catch (e) {
      console.error(e);
    }
  }, [token, aktiveFragen, antworten]);

  return (
    <div id={cssId || 'frdiv'}>
      <img id="frbook" src="/img/book.png" alt="book" />
      <div>
        <h1 id="Headline">Seite {seite} — Beantworte kurz ein paar Fragen</h1>
        <ul className="input">
          {aktiveFragen.map(({ frage, index }) => (
            <li key={index} className="liste">
              <label>
                <p>{frage}</p>
                <input
                  type="text"
                  value={antworten[index] || ''}
                  onChange={(e) => {
                    const neu = [...antworten];
                    neu[index] = e.target.value;
                    setAntworten(neu);
                  }}
                />
              </label>
            </li>
          ))}
        </ul>
        {gespeichert && <p style={{ color: 'green', textAlign: 'center' }}>Gespeichert!</p>}
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
        {vorSeite && (
          <button id="Freunde" onClick={handleSave}>
            <Link to={`/${vorSeite}-Freunde`}>{vorSeite}. Seite</Link>
          </button>
        )}
        {nachSeite && (
          <button id="Freunde" onClick={handleSave}>
            <Link to={`/${nachSeite}-Freunde`}>{nachSeite}. Seite</Link>
          </button>
        )}
      </div>
    </div>
  );
};

export default FreundebuchSeite;
