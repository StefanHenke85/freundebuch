import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { EVENT_TYPEN } from "../../data/eventFragen.js";
import { THEMES, EVENT_DEFAULT_THEME } from "../../data/eventThemes.js";

const ANLAESSE = [
  { ...EVENT_TYPEN.find(e => e.id === 'geburtstag'), bild: '🎂', stimmung: 'Lass deine Gäste für immer in deiner Erinnerung bleiben.' },
  { ...EVENT_TYPEN.find(e => e.id === 'hochzeit'),   bild: '💍', stimmung: 'Worte die ein Leben lang begleiten.' },
  { ...EVENT_TYPEN.find(e => e.id === 'taufe'),      bild: '⛪', stimmung: 'Liebevolle Wünsche für den Lebensstart.' },
  { ...EVENT_TYPEN.find(e => e.id === 'party'),      bild: '🎉', stimmung: 'Deine Feier, deine Geschichte.' },
  { ...EVENT_TYPEN.find(e => e.id === 'tcg'),        bild: '🃏', stimmung: 'Dokumentiere deine Community.' },
  { ...EVENT_TYPEN.find(e => e.id === 'eigener'),    bild: '📝', stimmung: 'Für jeden besonderen Moment.' },
];

export default function Home() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('hero'); // hero | event | theme | done
  const [event, setEvent] = useState(null);
  const [themeId, setThemeId] = useState(null);
  const [link, setLink] = useState('');
  const [kopiert, setKopiert] = useState(false);
  const [laden, setLaden] = useState(false);

  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];

  const waehleEvent = (ev) => {
    setEvent(ev);
    setThemeId(EVENT_DEFAULT_THEME[ev.id] || 'braun');
    setPhase('theme');
  };

  const erstelle = async () => {
    if (!token) {
      navigate(`/register?event=${event.id}&name=${encodeURIComponent(event.label)}&theme=${themeId}`);
      return;
    }
    setLaden(true);
    try {
      const res = await fetch('/api/link/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ event_typ: event.id, event_name: event.label, theme_id: themeId }),
      });
      const d = await res.json();
      setLink(d.link);
      setPhase('done');
    } catch { alert('Fehler.'); }
    finally { setLaden(false); }
  };

  const kopieren = () => {
    navigator.clipboard?.writeText(link);
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2500);
  };

  return (
    <div className="lp-root">

      {/* ── HERO ── */}
      {phase === 'hero' && (
        <div className="lp-hero">
          <div className="lp-hero-bg">
            <img src="/img/BraunesBuch.png" alt="" className="lp-hero-buch" />
            <div className="lp-hero-overlay" />
          </div>
          <div className="lp-hero-content">
            <p className="lp-hero-eyebrow">Digitales Gästebuch</p>
            <h1 className="lp-hero-titel">
              Erinnerungen die<br />
              <em>für immer bleiben</em>
            </h1>
            <p className="lp-hero-sub">
              Erstelle in Sekunden ein Gästebuch für dein Event.<br />
              Deine Gäste tragen sich ein — ganz ohne App.
            </p>
            <button className="lp-hero-cta" onClick={() => setPhase('event')}>
              Jetzt Gästebuch erstellen
            </button>
            <div className="lp-hero-pills">
              <span>🎂 Geburtstag</span>
              <span>💍 Hochzeit</span>
              <span>🎉 Party</span>
              <span>🃏 TCG</span>
              <span>⛪ Taufe</span>
            </div>
          </div>
          <div className="lp-hero-footer">
            {token
              ? <a href="/MeineEvents">Meine Events →</a>
              : <a href="/login">Bereits registriert? Anmelden</a>
            }
            <span className="lp-hero-footer-sep">·</span>
            <a href="/Impressum">Impressum</a>
            <span className="lp-hero-footer-sep">·</span>
            <a href="/Datenschutz">Datenschutz</a>
          </div>
        </div>
      )}

      {/* ── EVENT WÄHLEN ── */}
      {phase === 'event' && (
        <div className="lp-auswahl">
          <button className="lp-back" onClick={() => setPhase('hero')}>← Zurück</button>
          <h2 className="lp-auswahl-titel">Was feierst du?</h2>
          <p className="lp-auswahl-sub">Wähle deinen Anlass — wir passen alles automatisch an.</p>
          <div className="lp-event-grid">
            {ANLAESSE.map(ev => (
              <button key={ev.id} className="lp-event-card" onClick={() => waehleEvent(ev)}>
                <span className="lp-event-card-emoji">{ev.bild}</span>
                <span className="lp-event-card-name">{ev.label}</span>
                <span className="lp-event-card-sub">{ev.stimmung}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── DESIGN WÄHLEN ── */}
      {phase === 'theme' && (
        <div className="lp-auswahl">
          <button className="lp-back" onClick={() => setPhase('event')}>← Zurück</button>
          <h2 className="lp-auswahl-titel">
            {event?.emoji} {event?.label} — Welches Design?
          </h2>
          <p className="lp-auswahl-sub">Das Design sehen deine Gäste wenn sie den Link öffnen.</p>

          <div className="lp-theme-layout">
            {/* Theme-Auswahl */}
            <div className="lp-theme-grid">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  className={`lp-theme-card ${themeId === t.id ? 'aktiv' : ''}`}
                  onClick={() => setThemeId(t.id)}
                >
                  <div className="lp-theme-swatch">
                    <div style={{ background: t.coverGradient, height: '40%', borderRadius: '4px 4px 0 0' }} />
                    <div style={{ background: t.seite, flex: 1, position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: 4, left: 6, right: 6, height: 1, background: t.linie }} />
                      <div style={{ position: 'absolute', bottom: 8, left: 6, right: 14, height: 1, background: t.linie }} />
                    </div>
                  </div>
                  <span className="lp-theme-name">{t.emoji} {t.label}</span>
                  {themeId === t.id && <span className="lp-theme-aktiv-mark">✓</span>}
                </button>
              ))}
            </div>

            {/* Vorschau */}
            <div className="lp-vorschau-panel">
              <div className="lp-buch-mock" style={{ '--c': theme.coverGradient, '--s': theme.seite, '--r': theme.ruecken, '--l': theme.linie, '--a': theme.akzent, '--t': theme.coverText }}>
                <div className="lp-buch-mock-ruecken" />
                <div className="lp-buch-mock-block">
                  <div className="lp-buch-mock-cover">
                    <span style={{ fontSize: '2.2rem' }}>{event?.emoji}</span>
                    <span style={{ fontFamily: 'Dancing Script, cursive', color: 'var(--t)', fontSize: '1rem', textAlign: 'center', lineHeight: 1.2 }}>{event?.label}</span>
                  </div>
                  <div className="lp-buch-mock-page">
                    {[1,2,3,4].map(i => <div key={i} className="lp-buch-mock-linie" />)}
                    <div className="lp-buch-mock-avatar" />
                  </div>
                </div>
              </div>
              <p className="lp-vorschau-name" style={{ color: theme.akzent === '#f5efe6' ? '#c4a882' : theme.akzent }}>
                {theme.emoji} <strong>{theme.label}</strong>
              </p>
              <button
                className="lp-erstellen-btn"
                style={{ background: theme.coverGradient }}
                onClick={erstelle}
                disabled={laden}
              >
                {laden ? '⏳ Erstelle…' : token ? `${event?.emoji} Link erstellen` : 'Kostenlos starten →'}
              </button>
              {!token && <p className="lp-erstellen-hinweis">Nur E-Mail + Passwort — 10 Sekunden</p>}
            </div>
          </div>
        </div>
      )}

      {/* ── FERTIG ── */}
      {phase === 'done' && (
        <div className="lp-done">
          <div className="lp-done-icon">{event?.emoji}</div>
          <h2 className="lp-done-titel">Fertig! Dein Gästebuch wartet.</h2>
          <p className="lp-done-sub">{event?.label} · {theme.emoji} {theme.label}</p>

          <div className="lp-done-link-box">
            <input
              className="lp-done-input"
              type="text"
              value={link}
              readOnly
              onClick={e => e.target.select()}
            />
            <button
              className="lp-done-copy"
              style={{ background: theme.coverGradient }}
              onClick={kopieren}
            >
              {kopiert ? '✓ Kopiert!' : '📋 Kopieren'}
            </button>
          </div>

          <p className="lp-done-hinweis">
            Schick diesen Link per WhatsApp, Instagram oder E-Mail an deine Gäste.<br />
            <strong>Kein Account nötig</strong> — sie tragen sich direkt ein.
          </p>

          <div className="lp-done-actions">
            <button className="lp-done-neu" onClick={() => { setPhase('hero'); setEvent(null); setLink(''); }}>
              + Weiteres Gästebuch erstellen
            </button>
            <a className="lp-done-events" href="/MeineEvents">Alle meine Events →</a>
          </div>
        </div>
      )}
    </div>
  );
}
