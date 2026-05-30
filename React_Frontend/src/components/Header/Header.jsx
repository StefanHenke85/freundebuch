import React, { useState, useRef } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { EVENT_TYPEN } from '../../data/eventFragen.js';
import { THEMES, EVENT_DEFAULT_THEME } from '../../data/eventThemes.js';

const Header = () => {
  const [dialog, setDialog] = useState(null); // null | 'auswahl' | 'link'
  const [eventTyp, setEventTyp] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDatum, setEventDatum] = useState('');
  const [themeId, setThemeId] = useState('braun');
  const [link, setLink] = useState('');
  const [kopiert, setKopiert] = useState(false);
  const [ladend, setLadend] = useState(false);
  const [schritt, setSchritt] = useState(1); // 1=event, 2=theme, 3=details
  const linkInputRef = useRef(null);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const oeffneDialog = (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    setDialog('auswahl');
    setEventTyp('');
    setEventName('');
    setEventDatum('');
    setThemeId('braun');
    setLink('');
    setSchritt(1);
  };

  const handleEventWahl = (id) => {
    setEventTyp(id);
    setThemeId(EVENT_DEFAULT_THEME[id] || 'braun');
    setSchritt(2);
  };

  const handleLinkGenerieren = async () => {
    if (!eventTyp) return;
    setLadend(true);
    try {
      const res = await fetch('/api/link/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          event_typ: eventTyp,
          event_name: eventName,
          event_datum: eventDatum || null,
          theme_id: themeId,
        }),
      });
      const data = await res.json();
      setLink(data.link);
      setDialog('link');
    } catch {
      alert('Fehler beim Generieren des Links.');
    } finally {
      setLadend(false);
    }
  };

  const handleKopieren = () => {
    if (!link) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(() => { setKopiert(true); setTimeout(() => setKopiert(false), 2500); });
    } else if (linkInputRef.current) {
      linkInputRef.current.select();
      document.execCommand('copy');
      setKopiert(true);
      setTimeout(() => setKopiert(false), 2500);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const gewaehlterTyp = EVENT_TYPEN.find(e => e.id === eventTyp);
  const gewaehlterTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li><Link className="nav-button" to="/Home">Home</Link></li>
          <li><Link className="nav-button" to="/Profil">Profil</Link></li>
          <li><Link className="nav-button" to="/1-Freunde">Freundebuch</Link></li>
          <li><a href="/" className="nav-button nav-button-highlight" onClick={oeffneDialog}>+ Event erstellen</a></li>
          <li><Link className="nav-button" to="/MeineEvents">Meine Events</Link></li>
          <li><Link className="nav-button" to="/drucken">🖨️ Drucken</Link></li>
          {user && (
            <li>
              <button className="nav-button logout-btn" onClick={handleLogout}>
                Logout ({user.username || user.email?.split('@')[0]})
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="logo">
        <span id="logoH">📖 Freundebuch</span>
      </div>

      {/* Event-Dialog */}
      {dialog === 'auswahl' && (
        <div className="event-overlay" onClick={() => setDialog(null)}>
          <div className="event-dialog" onClick={e => e.stopPropagation()}>
            <div className="event-dialog-header">
              <h2 className="event-dialog-titel">Neues Gästebuch</h2>
              <button className="event-schliessen" onClick={() => setDialog(null)}>✕</button>
            </div>

            {/* Schritt-Anzeige */}
            <div className="event-schritte">
              {['Anlass', 'Design', 'Details'].map((s, i) => (
                <React.Fragment key={i}>
                  <div
                    className={`event-schritt-pill ${schritt === i+1 ? 'aktiv' : schritt > i+1 ? 'fertig' : ''}`}
                    onClick={() => schritt > i+1 && setSchritt(i+1)}
                  >
                    {schritt > i+1 ? '✓' : i+1} {s}
                  </div>
                  {i < 2 && <div className="event-schritt-linie" />}
                </React.Fragment>
              ))}
            </div>

            {/* Schritt 1: Event-Typ */}
            {schritt === 1 && (
              <>
                <p className="event-dialog-hinweis">Für welchen Anlass ist das Gästebuch?</p>
                <div className="event-typ-grid">
                  {EVENT_TYPEN.map(typ => (
                    <button
                      key={typ.id}
                      className={`event-typ-btn ${eventTyp === typ.id ? 'event-typ-aktiv' : ''}`}
                      style={eventTyp === typ.id ? { borderColor: typ.farbe, background: typ.farbe + '18' } : {}}
                      onClick={() => handleEventWahl(typ.id)}
                    >
                      <span className="event-typ-emoji">{typ.emoji}</span>
                      <span className="event-typ-label">{typ.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Schritt 2: Design */}
            {schritt === 2 && (
              <>
                <p className="event-dialog-hinweis">Wähle ein Design für {gewaehlterTyp?.emoji} {gewaehlterTyp?.label}:</p>
                <div className="event-theme-grid">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      className={`event-theme-btn ${themeId === t.id ? 'aktiv' : ''}`}
                      onClick={() => setThemeId(t.id)}
                      title={t.label}
                    >
                      <div className="event-theme-vorschau">
                        <div style={{ background: t.vorschau[0], height: '18px', borderRadius: '3px 3px 0 0' }} />
                        <div style={{ background: t.vorschau[1], height: '18px' }} />
                        <div style={{ background: t.vorschau[2], height: '4px' }} />
                      </div>
                      <span className="event-theme-label">{t.emoji} {t.label}</span>
                      {themeId === t.id && <span className="event-theme-check">✓</span>}
                    </button>
                  ))}
                </div>
                <button
                  className="event-weiter-btn"
                  style={{ background: gewaehlterTheme.coverGradient }}
                  onClick={() => setSchritt(3)}
                >
                  Weiter mit {gewaehlterTheme.emoji} {gewaehlterTheme.label} →
                </button>
              </>
            )}

            {/* Schritt 3: Details + Erstellen */}
            {schritt === 3 && (
              <>
                <p className="event-dialog-hinweis">Letzte Details (optional):</p>
                <div className="event-details">
                  <label className="event-detail-label">
                    Name des Events
                    <input className="event-detail-input" type="text"
                      placeholder={`z.B. ${gewaehlterTyp?.emoji} Stefans ${gewaehlterTyp?.label}`}
                      value={eventName} onChange={e => setEventName(e.target.value)} />
                  </label>
                  <label className="event-detail-label">
                    Datum
                    <input className="event-detail-input" type="date"
                      value={eventDatum} onChange={e => setEventDatum(e.target.value)} />
                  </label>

                  {/* Mini-Vorschau */}
                  <div className="event-mini-vorschau">
                    <div style={{ width: 10, background: gewaehlterTheme.ruecken, borderRadius: '2px 0 0 2px' }} />
                    <div style={{ flex: 1, background: gewaehlterTheme.seite, padding: '0.4rem 0.6rem' }}>
                      <div style={{ height: 3, background: gewaehlterTheme.akzent, opacity: 0.5, marginBottom: 4, borderRadius: 1 }} />
                      <div style={{ height: 2, background: gewaehlterTheme.linie, marginBottom: 3, borderRadius: 1 }} />
                      <div style={{ height: 2, background: gewaehlterTheme.linie, borderRadius: 1 }} />
                    </div>
                  </div>

                  <button
                    className="event-generieren-btn"
                    style={{ background: gewaehlterTheme.coverGradient }}
                    onClick={handleLinkGenerieren}
                    disabled={ladend}
                  >
                    {ladend ? 'Erstelle Link…' : `${gewaehlterTyp?.emoji} Gästebuch erstellen`}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Link anzeigen */}
      {dialog === 'link' && (
        <div className="share-popup">
          <p className="share-popup-titel">
            {gewaehlterTyp?.emoji} Gästebuch bereit: <strong>{eventName || gewaehlterTyp?.label}</strong>
          </p>
          <div className="share-popup-row">
            <input ref={linkInputRef} className="share-link-input" type="text"
              value={link} readOnly onClick={e => e.target.select()} />
            <button className="share-kopieren-btn" onClick={handleKopieren}>
              {kopiert ? '✓ Kopiert!' : 'Kopieren'}
            </button>
            <button className="share-schliessen-btn" onClick={() => setDialog(null)}>✕</button>
          </div>
          <p className="share-popup-hinweis">Schick diesen Link an deine Gäste — kein Account nötig!</p>
        </div>
      )}
    </header>
  );
};

export default Header;
