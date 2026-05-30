import React, { useState, useRef } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { EVENT_TYPEN } from '../../data/eventFragen.js';

const Header = () => {
  const [dialog, setDialog] = useState(null); // null | 'auswahl' | 'link'
  const [eventTyp, setEventTyp] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDatum, setEventDatum] = useState('');
  const [link, setLink] = useState('');
  const [kopiert, setKopiert] = useState(false);
  const [ladend, setLadend] = useState(false);
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
    setLink('');
  };

  const handleEventTypWahl = (id) => setEventTyp(id);

  const handleLinkGenerieren = async () => {
    if (!eventTyp) return;
    setLadend(true);
    try {
      const res = await fetch('/api/link/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ event_typ: eventTyp, event_name: eventName, event_datum: eventDatum || null }),
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

  const handleLogout = () => { logout(); navigate('/login'); };

  const gewaehlterTyp = EVENT_TYPEN.find(e => e.id === eventTyp);

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
                Logout ({user.username})
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="logo">
        <span id="logoH">📖 Freundebuch</span>
      </div>

      {/* Event-Auswahl Dialog */}
      {dialog === 'auswahl' && (
        <div className="event-overlay" onClick={() => setDialog(null)}>
          <div className="event-dialog" onClick={e => e.stopPropagation()}>
            <div className="event-dialog-header">
              <h2 className="event-dialog-titel">Neues Gästebuch erstellen</h2>
              <button className="event-schliessen" onClick={() => setDialog(null)}>✕</button>
            </div>

            <p className="event-dialog-hinweis">Wähle den Event-Typ:</p>
            <div className="event-typ-grid">
              {EVENT_TYPEN.map(typ => (
                <button
                  key={typ.id}
                  className={`event-typ-btn ${eventTyp === typ.id ? 'event-typ-aktiv' : ''}`}
                  style={eventTyp === typ.id ? { borderColor: typ.farbe, background: typ.farbe + '18' } : {}}
                  onClick={() => handleEventTypWahl(typ.id)}
                >
                  <span className="event-typ-emoji">{typ.emoji}</span>
                  <span className="event-typ-label">{typ.label}</span>
                </button>
              ))}
            </div>

            {eventTyp && (
              <div className="event-details">
                <label className="event-detail-label">
                  Name des Events (optional)
                  <input
                    className="event-detail-input"
                    type="text"
                    placeholder={gewaehlterTyp ? `z.B. ${gewaehlterTyp.emoji} ${gewaehlterTyp.label} von Stefan` : ''}
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                  />
                </label>
                <label className="event-detail-label">
                  Datum (optional)
                  <input
                    className="event-detail-input"
                    type="date"
                    value={eventDatum}
                    onChange={e => setEventDatum(e.target.value)}
                  />
                </label>
                <button
                  className="event-generieren-btn"
                  onClick={handleLinkGenerieren}
                  disabled={ladend}
                  style={{ background: gewaehlterTyp?.farbe }}
                >
                  {ladend ? 'Erstelle Link…' : `${gewaehlterTyp?.emoji} Gästebuch-Link erstellen`}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Link anzeigen */}
      {dialog === 'link' && (
        <div className="share-popup">
          <p className="share-popup-titel">
            {gewaehlterTyp?.emoji} Gästebuch-Link für{' '}
            <strong>{eventName || gewaehlterTyp?.label}</strong>:
          </p>
          <div className="share-popup-row">
            <input
              ref={linkInputRef}
              className="share-link-input"
              type="text"
              value={link}
              readOnly
              onClick={e => e.target.select()}
            />
            <button className="share-kopieren-btn" onClick={handleKopieren}>
              {kopiert ? '✓ Kopiert!' : 'Kopieren'}
            </button>
            <button className="share-schliessen-btn" onClick={() => setDialog(null)}>✕</button>
          </div>
          <p className="share-popup-hinweis">Schick diesen Link an deine Gäste — sie können direkt eintragen, kein Account nötig!</p>
        </div>
      )}
    </header>
  );
};

export default Header;
