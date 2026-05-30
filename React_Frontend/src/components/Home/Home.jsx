import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { EVENT_TYPEN } from "../../data/eventFragen.js";
import { THEMES, EVENT_DEFAULT_THEME } from "../../data/eventThemes.js";

const ANLAESSE = [
  { ...EVENT_TYPEN.find(e => e.id === 'geburtstag'), stimmung: 'Lass deine Gäste für immer in deiner Erinnerung bleiben.' },
  { ...EVENT_TYPEN.find(e => e.id === 'hochzeit'),   stimmung: 'Worte die ein Leben lang begleiten.' },
  { ...EVENT_TYPEN.find(e => e.id === 'taufe'),      stimmung: 'Liebevolle Wünsche für den Lebensstart.' },
  { ...EVENT_TYPEN.find(e => e.id === 'party'),      stimmung: 'Deine Feier, deine Geschichte.' },
  { ...EVENT_TYPEN.find(e => e.id === 'tcg'),        stimmung: 'Dokumentiere deine Community.' },
  { ...EVENT_TYPEN.find(e => e.id === 'eigener'),    stimmung: 'Für jeden besonderen Moment.' },
];

export default function Home() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('hero');
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

          {/* Top-Leiste */}
          <div className="lp-hero-topbar">
            <span className="lp-hero-topbar-logo">📖 Freundebuch</span>
            <div className="lp-hero-topbar-rechts">
              {token ? (
                <>
                  <a href="/dashboard" className="lp-topbar-btn lp-topbar-btn-outline">🏠 Mein Dashboard</a>
                  <button className="lp-topbar-btn lp-topbar-btn-outline" onClick={() => { logout(); navigate('/'); }}>Abmelden</button>
                </>
              ) : (
                <>
                  <a href="/login" className="lp-topbar-btn lp-topbar-btn-outline">Anmelden</a>
                  <a href="/register" className="lp-topbar-btn lp-topbar-btn-solid">Registrieren</a>
                </>
              )}
            </div>
          </div>

          <div className="lp-hero-content">
            <p className="lp-hero-eyebrow">Digitales Gästebuch</p>
            <h1 className="lp-hero-titel">
              Erinnerungen die<br />
              <em>für immer bleiben</em>
            </h1>
            <p className="lp-hero-sub">
              Erstelle ein Gästebuch für dein Event — deine Gäste tragen sich ein,
              ganz ohne App oder Registrierung.
            </p>

            {/* Wer-macht-was Box */}
            <div className="lp-hero-wer">
              <div className="lp-hero-wer-block lp-hero-wer-gastgeber">
                <span className="lp-hero-wer-icon">🎉</span>
                <div>
                  <strong>Du organisierst ein Event?</strong>
                  <p>Kurz registrieren, Gästebuch erstellen, Link teilen. Fertig!</p>
                  <button className="lp-hero-cta" onClick={() => setPhase('event')}>
                    Jetzt Gästebuch erstellen
                  </button>
                </div>
              </div>
              <div className="lp-hero-wer-trenner" />
              <div className="lp-hero-wer-block lp-hero-wer-gast">
                <span className="lp-hero-wer-icon">✏️</span>
                <div>
                  <strong>Du wurdest eingeladen?</strong>
                  <p>Einfach den Link öffnen den du erhalten hast — kein Account nötig!</p>
                  <span className="lp-hero-wer-hinweis">Den Link findest du in WhatsApp, der Einladung oder per E-Mail.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lp-hero-pills">
            <span>🎂 Geburtstag</span>
            <span>💍 Hochzeit</span>
            <span>🎉 Party</span>
            <span>🃏 TCG Event</span>
            <span>⛪ Taufe</span>
            <span>📝 Eigener Event</span>
          </div>

          <div className="lp-hero-footer">
            {token
              ? <a href="/dashboard">Zum Dashboard →</a>
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
          <p className="lp-auswahl-sub">Wähle deinen Anlass — wir passen Fragen und Design automatisch an.</p>

          {/* Schritt-Anzeige */}
          <div className="lp-steps-bar">
            <div className="lp-step-dot aktiv">1</div>
            <div className="lp-step-line" />
            <div className="lp-step-dot">2</div>
            <div className="lp-step-line" />
            <div className="lp-step-dot">{token ? '✓' : '3'}</div>
            <span className="lp-step-label">{token ? 'Schritt 1 von 2' : 'Schritt 1 von 3'}</span>
          </div>

          <div className="lp-event-grid">
            {ANLAESSE.map(ev => (
              <button key={ev.id} className="lp-event-card" onClick={() => waehleEvent(ev)}>
                <span className="lp-event-card-emoji">{ev.emoji}</span>
                <span className="lp-event-card-name">{ev.label}</span>
                <span className="lp-event-card-sub">{ev.stimmung}</span>
              </button>
            ))}
          </div>

          {!token && (
            <p className="lp-kein-account-hinweis">
              🔒 Du brauchst einen kostenlosen Account um ein Gästebuch zu erstellen.
              Deine Gäste brauchen keinen Account — die öffnen einfach deinen Link.
            </p>
          )}
        </div>
      )}

      {/* ── DESIGN WÄHLEN ── */}
      {phase === 'theme' && (
        <div className="lp-auswahl">
          <button className="lp-back" onClick={() => setPhase('event')}>← Zurück</button>
          <h2 className="lp-auswahl-titel">{event?.emoji} {event?.label} — Welches Design?</h2>
          <p className="lp-auswahl-sub">Das Design sehen deine Gäste wenn sie den Link öffnen.</p>

          <div className="lp-steps-bar">
            <div className="lp-step-dot fertig" onClick={() => setPhase('event')}>✓</div>
            <div className="lp-step-line aktiv" />
            <div className="lp-step-dot aktiv">2</div>
            <div className="lp-step-line" />
            <div className="lp-step-dot">{token ? '→' : '3'}</div>
            <span className="lp-step-label">{token ? 'Schritt 2 von 2' : 'Schritt 2 von 3'}</span>
          </div>

          <div className="lp-theme-layout">
            <div className="lp-theme-grid">
              {THEMES.map(t => (
                <button key={t.id} className={`lp-theme-card ${themeId === t.id ? 'aktiv' : ''}`} onClick={() => setThemeId(t.id)}>
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

            <div className="lp-vorschau-panel">
              {/* Buch */}
              <div className="lp-buch-mock" style={{ '--c': theme.coverGradient, '--s': theme.seite, '--r': theme.ruecken, '--l': theme.linie, '--a': theme.akzent, '--t': theme.coverText }}>
                <div className="lp-buch-mock-ruecken" />
                <div className="lp-buch-mock-block">
                  <div className="lp-buch-mock-cover">
                    <span style={{ fontSize: '2.2rem' }}>{event?.emoji}</span>
                    <span style={{ fontFamily: 'Dancing Script,cursive', color: 'var(--t)', fontSize: '1rem', textAlign: 'center', lineHeight: 1.2 }}>{event?.label}</span>
                  </div>
                  <div className="lp-buch-mock-page">
                    {[1,2,3,4].map(i => <div key={i} className="lp-buch-mock-linie" />)}
                    <div className="lp-buch-mock-avatar" />
                  </div>
                </div>
              </div>
              <p className="lp-vorschau-name" style={{ color: '#c4a882' }}>{theme.emoji} <strong>{theme.label}</strong></p>

              {/* CTA mit Erklärung */}
              {token ? (
                <button className="lp-erstellen-btn" style={{ background: theme.coverGradient }} onClick={erstelle} disabled={laden}>
                  {laden ? '⏳ Erstelle Link…' : `${event?.emoji} Link jetzt erstellen`}
                </button>
              ) : (
                <div className="lp-register-box">
                  <p className="lp-register-box-titel">Fast fertig! 🎉</p>
                  <p className="lp-register-box-text">
                    Erstelle jetzt kostenlos ein Konto um deinen Gästebuch-Link zu erhalten.
                    <br /><strong>Nur E-Mail + Passwort — dauert 10 Sekunden.</strong>
                  </p>
                  <button className="lp-erstellen-btn" style={{ background: theme.coverGradient }} onClick={erstelle}>
                    Kostenlos registrieren & Link erstellen
                  </button>
                  <p className="lp-register-box-hinweis">
                    Bereits ein Konto? <a href="/login">Anmelden</a>
                  </p>
                </div>
              )}
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
            <input className="lp-done-input" type="text" value={link} readOnly onClick={e => e.target.select()} />
            <button className="lp-done-copy" style={{ background: theme.coverGradient }} onClick={kopieren}>
              {kopiert ? '✓ Kopiert!' : '📋 Kopieren'}
            </button>
          </div>

          <div className="lp-done-erklaerung">
            <div className="lp-done-step">
              <span>1️⃣</span>
              <span>Kopiere den Link oben</span>
            </div>
            <div className="lp-done-step">
              <span>2️⃣</span>
              <span>Schick ihn per WhatsApp, Instagram oder E-Mail an deine Gäste</span>
            </div>
            <div className="lp-done-step">
              <span>3️⃣</span>
              <span>Deine Gäste öffnen den Link und tragen sich ein — kein Account nötig!</span>
            </div>
            <div className="lp-done-step">
              <span>4️⃣</span>
              <span>Alle Einträge siehst du unter <a href="/MeineEvents">Meine Events</a></span>
            </div>
          </div>

          <div className="lp-done-actions">
            <button className="lp-done-neu" onClick={() => { setPhase('hero'); setEvent(null); setLink(''); }}>
              + Weiteres Gästebuch erstellen
            </button>
            <a className="lp-done-events" href="/dashboard">Zum Dashboard →</a>
          </div>
        </div>
      )}
    </div>
  );
}
