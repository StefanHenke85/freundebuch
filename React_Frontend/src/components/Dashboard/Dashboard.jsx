import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getEventTyp } from '../../data/eventFragen.js';
import { getThemeById } from '../../data/eventThemes.js';
import './Dashboard.css';

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [laden, setLaden] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetch('/api/events?action=liste', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setEvents(Array.isArray(d) ? d.slice(0, 3) : []); setLaden(false); })
      .catch(() => setLaden(false));
  }, [token, navigate]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="dash-root">
      {/* Top-Bar */}
      <header className="dash-header">
        <span className="dash-logo">📖 Freundebuch</span>
        <div className="dash-header-right">
          <span className="dash-username">👤 {user?.email?.split('@')[0] || user?.username}</span>
          <button className="dash-logout" onClick={handleLogout}>Abmelden</button>
        </div>
      </header>

      {/* Haupt-Bereich */}
      <main className="dash-main">

        {/* Begrüßung */}
        <div className="dash-willkommen">
          <h1 className="dash-titel">
            Hallo{user?.vorname ? `, ${user.vorname}` : ''}! 👋
          </h1>
          <p className="dash-sub">Was möchtest du heute tun?</p>
        </div>

        {/* 3 Haupt-Aktionen */}
        <div className="dash-aktionen">

          <button className="dash-karte dash-karte-primary" onClick={() => navigate('/?erstellen=1')}>
            <span className="dash-karte-icon">✨</span>
            <span className="dash-karte-titel">Neues Gästebuch erstellen</span>
            <span className="dash-karte-sub">Event wählen, Design aussuchen, Link teilen</span>
          </button>

          <button className="dash-karte" onClick={() => navigate('/MeineEvents')}>
            <span className="dash-karte-icon">📋</span>
            <span className="dash-karte-titel">Meine Events & Gäste</span>
            <span className="dash-karte-sub">
              {laden ? '…' : events.length === 0 ? 'Noch keine Events' : `${events.length} aktive Event${events.length !== 1 ? 's' : ''}`}
            </span>
          </button>

          <button className="dash-karte" onClick={() => navigate('/FlipBook')}>
            <span className="dash-karte-icon">📖</span>
            <span className="dash-karte-titel">Mein Freundebuch</span>
            <span className="dash-karte-sub">Deine eigenen Antworten durchblättern</span>
          </button>

          <button className="dash-karte" onClick={() => navigate('/Profil')}>
            <span className="dash-karte-icon">👤</span>
            <span className="dash-karte-titel">Mein Profil</span>
            <span className="dash-karte-sub">Name, Foto, Geburtstag bearbeiten</span>
          </button>

          <button className="dash-karte" onClick={() => navigate('/drucken')}>
            <span className="dash-karte-icon">🖨️</span>
            <span className="dash-karte-titel">Drucken & PDF</span>
            <span className="dash-karte-sub">Gästebuch als PDF speichern oder drucken</span>
          </button>

          <button className="dash-karte" onClick={() => navigate('/1-Freunde')}>
            <span className="dash-karte-icon">✏️</span>
            <span className="dash-karte-titel">Freundebuch ausfüllen</span>
            <span className="dash-karte-sub">Deine eigenen Fragen beantworten</span>
          </button>

        </div>

        {/* Letzte Events */}
        {!laden && events.length > 0 && (
          <div className="dash-events">
            <div className="dash-events-header">
              <h2 className="dash-events-titel">Letzte Events</h2>
              <button className="dash-events-alle" onClick={() => navigate('/MeineEvents')}>Alle anzeigen →</button>
            </div>
            <div className="dash-events-liste">
              {events.map(ev => {
                const typ = getEventTyp(ev.event_typ);
                const theme = getThemeById(ev.theme_id || 'braun');
                const base = window.location.origin;
                return (
                  <div key={ev.id} className="dash-event-item" style={{ borderLeftColor: typ.farbe }}>
                    <span className="dash-event-emoji">{typ.emoji}</span>
                    <div className="dash-event-info">
                      <strong>{ev.event_name || typ.label}</strong>
                      <span>{new Date(ev.created_at).toLocaleDateString('de-DE')} · {ev.eintraege_anzahl} Gäste · {theme.emoji} {theme.label}</span>
                    </div>
                    <button
                      className="dash-event-link"
                      onClick={() => { navigator.clipboard?.writeText(`${base}/freund/${ev.id}`); }}
                      title="Link kopieren"
                    >
                      🔗
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leerer Zustand */}
        {!laden && events.length === 0 && (
          <div className="dash-leer">
            <span className="dash-leer-icon">🎉</span>
            <p className="dash-leer-text">Du hast noch kein Gästebuch erstellt.</p>
            <button className="dash-leer-btn" onClick={() => navigate('/?erstellen=1')}>
              Jetzt erstes Gästebuch erstellen
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
