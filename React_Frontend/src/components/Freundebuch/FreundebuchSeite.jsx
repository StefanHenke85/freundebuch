import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./freundebuch.css";

const FreundebuchSeite = ({ seite, vonIndex, bisIndex, vorSeite, nachSeite, fragen: fragenProp }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [fragen, setFragen] = useState([]);
  const [antworten, setAntworten] = useState([]);
  const [gespeichert, setGespeichert] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    if (fragenProp) { setFragen(fragenProp); return; }

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
    if (!token || fragen.length === 0) return;
    fetch('/api/antworten', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const aktiveFragen = fragenProp || fragen.slice(vonIndex, bisIndex).map(f => f.frage);
        const slice = aktiveFragen.map(f => {
          const found = data.find(a => a.frage === (fragenProp ? f : f));
          return found ? found.antwort : '';
        });
        setAntworten(slice);
      })
      .catch(console.error);
  }, [token, fragen, vonIndex, bisIndex, fragenProp]);

  const aktiveFragen = fragenProp
    ? fragenProp
    : fragen.slice(vonIndex, bisIndex).map(f => f.frage);

  const handleSave = useCallback(async () => {
    if (!token) return;
    const alle = JSON.parse(sessionStorage.getItem('fb_antworten') || '[]');
    aktiveFragen.forEach((frage, index) => {
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

  const linksSeite = aktiveFragen.slice(0, Math.ceil(aktiveFragen.length / 2));
  const rechtsSeite = aktiveFragen.slice(Math.ceil(aktiveFragen.length / 2));
  const linksStart = 0;
  const rechtsStart = Math.ceil(aktiveFragen.length / 2);

  return (
    <div className="buch-wrapper">
      <div className="buch">
        {/* Linke Seite */}
        <div className="buch-links" data-page={`Seite ${(seite - 1) * 2 + 1}`}>
          <p className="buch-titel">Beantworte ein paar Fragen</p>
          <ul className="buch-fragen-liste">
            {linksSeite.map((frage, i) => (
              <li key={i} className="buch-frage-item">
                <label>
                  <span className="buch-frage-text">{frage}</span>
                  <input
                    className="buch-input"
                    type="text"
                    value={antworten[linksStart + i] || ''}
                    onChange={e => {
                      const neu = [...antworten];
                      neu[linksStart + i] = e.target.value;
                      setAntworten(neu);
                    }}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>

        {/* Rechte Seite */}
        <div className="buch-rechts" data-page={`Seite ${(seite - 1) * 2 + 2}`}>
          <p className="buch-titel">&nbsp;</p>
          <ul className="buch-fragen-liste">
            {rechtsSeite.map((frage, i) => (
              <li key={i} className="buch-frage-item">
                <label>
                  <span className="buch-frage-text">{frage}</span>
                  <input
                    className="buch-input"
                    type="text"
                    value={antworten[rechtsStart + i] || ''}
                    onChange={e => {
                      const neu = [...antworten];
                      neu[rechtsStart + i] = e.target.value;
                      setAntworten(neu);
                    }}
                  />
                </label>
              </li>
            ))}
          </ul>

          <div className="buch-nav">
            {vorSeite
              ? <Link className="buch-nav-btn" to={`/${vorSeite}-Freunde`} onClick={handleSave}>← {vorSeite}. Seite</Link>
              : <span />
            }
            <span className="buch-seite-nr">{seite} / 10</span>
            {nachSeite
              ? <Link className="buch-nav-btn" to={`/${nachSeite}-Freunde`} onClick={handleSave}>{nachSeite}. Seite →</Link>
              : <Link className="buch-nav-btn" to="/FlipBook" onClick={handleSave}>Fertig →</Link>
            }
          </div>
          {gespeichert && <p className="buch-speichern-status">✓ Gespeichert</p>}
        </div>
      </div>
    </div>
  );
};

export default FreundebuchSeite;
