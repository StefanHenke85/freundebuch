import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { EVENT_TYPEN } from "../../data/eventFragen.js";
import { THEMES, EVENT_DEFAULT_THEME } from "../../data/eventThemes.js";

const Home = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [gewaehlterEvent, setGewaehlterEvent] = useState(null);
  const [gewaehlterTheme, setGewaehlterTheme] = useState(null);
  const [erstelle, setErstelle] = useState(false);
  const [link, setLink] = useState('');
  const [kopiert, setKopiert] = useState(false);

  const handleEventWahl = (typ) => {
    setGewaehlterEvent(typ);
    setGewaehlterTheme(EVENT_DEFAULT_THEME[typ.id] || 'braun');
    setLink('');
  };

  const handleStart = async () => {
    if (!gewaehlterEvent || !gewaehlterTheme) return;

    if (!token) {
      // Nicht eingeloggt → zur Registrierung mit Vorauswahl
      const params = new URLSearchParams({
        event: gewaehlterEvent.id,
        name: gewaehlterEvent.label,
        theme: gewaehlterTheme,
      });
      navigate(`/register?${params.toString()}`);
      return;
    }

    // Eingeloggt → direkt Event erstellen
    setErstelle(true);
    try {
      const res = await fetch('/api/link/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          event_typ: gewaehlterEvent.id,
          event_name: gewaehlterEvent.label,
          theme_id: gewaehlterTheme,
        }),
      });
      const data = await res.json();
      setLink(data.link);
    } catch {
      alert('Fehler beim Erstellen des Events.');
    } finally {
      setErstelle(false);
    }
  };

  const handleKopieren = () => {
    navigator.clipboard?.writeText(link);
    setKopiert(true);
    setTimeout(() => setKopiert(false), 2500);
  };

  const activeTheme = THEMES.find(t => t.id === gewaehlterTheme) || THEMES[0];

  return (
    <div className="home-page">

      {/* Hero */}
      <section className="home-hero">
        <img className="home-hero-buch" src="/img/BraunesBuch.png" alt="" />
        <img className="home-hero-feder" src="/img/feder.png" alt="" />
        <div className="home-hero-content">
          <p className="home-hero-label">Digitales Gästebuch</p>
          <h1 className="home-hero-titel">Freundebuch</h1>
          <p className="home-hero-sub">
            Erstelle in Sekunden ein persönliches Gästebuch für jeden Anlass.<br />
            Deine Gäste tragen sich ein — kein Account nötig.
          </p>
          <div className="home-hero-buttons">
            <a className="home-btn" href="#erstellen">Jetzt Gästebuch erstellen ↓</a>
            {token
              ? <a className="home-btn home-btn-outline" href="/MeineEvents">Meine Events</a>
              : <a className="home-btn home-btn-outline" href="/login">Anmelden</a>
            }
          </div>
        </div>
      </section>

      {/* Schritte */}
      <section className="home-steps">
        <h2 className="home-steps-titel">So einfach geht's</h2>
        <div className="home-steps-liste">
          {[
            { nr: '1', titel: 'Event & Design wählen', text: 'Wähle Anlass und Farbdesign — live Vorschau inklusive.' },
            { nr: '2', titel: token ? 'Link direkt erstellen' : 'Kurz registrieren', text: token ? 'Als eingeloggter Nutzer bekommst du den Link sofort.' : 'Nur E-Mail und Passwort — in 10 Sekunden fertig.' },
            { nr: '3', titel: 'Link teilen', text: 'Schick den Link per WhatsApp, Instagram oder E-Mail.' },
            { nr: '4', titel: 'Einträge sammeln', text: 'Gäste tragen sich ein — mit Foto und Antworten.' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="home-step">
                <div className="home-step-nr">{s.nr}</div>
                <div><strong>{s.titel}</strong><p>{s.text}</p></div>
              </div>
              {i < arr.length - 1 && <div className="home-step-linie" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Konfigurator */}
      <section className="home-erstellen" id="erstellen">
        <h2 className="home-erstellen-titel">
          {token ? 'Neues Gästebuch erstellen' : 'Dein Gästebuch in 3 Klicks'}
        </h2>

        {/* Schritt 1: Event */}
        <div className="home-schritt">
          <p className="home-schritt-label">① Wähle deinen Anlass</p>
          <div className="home-event-grid">
            {EVENT_TYPEN.map(typ => (
              <button
                key={typ.id}
                className={`home-event-btn ${gewaehlterEvent?.id === typ.id ? 'aktiv' : ''}`}
                style={gewaehlterEvent?.id === typ.id ? { borderColor: typ.farbe, background: typ.farbe + '22' } : {}}
                onClick={() => handleEventWahl(typ)}
              >
                <span className="home-event-emoji">{typ.emoji}</span>
                <span>{typ.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Schritt 2: Design */}
        {gewaehlterEvent && (
          <div className="home-schritt">
            <p className="home-schritt-label">② Wähle ein Design</p>
            <div className="home-theme-grid">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  className={`home-theme-btn ${gewaehlterTheme === t.id ? 'aktiv' : ''}`}
                  onClick={() => { setGewaehlterTheme(t.id); setLink(''); }}
                  title={t.label}
                >
                  <div className="home-theme-vorschau">
                    <div style={{ background: t.vorschau[0], flex: 1, borderRadius: '3px 3px 0 0' }} />
                    <div style={{ background: t.vorschau[1], flex: 2 }} />
                    <div style={{ background: t.vorschau[2], height: '3px' }} />
                  </div>
                  <span className="home-theme-label">{t.emoji} {t.label}</span>
                  {gewaehlterTheme === t.id && <span className="home-theme-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schritt 3: Vorschau + CTA */}
        {gewaehlterEvent && gewaehlterTheme && !link && (
          <div className="home-vorschau">
            {/* Buch-Vorschau */}
            <div className="home-buch-vorschau-wrap">
              <div className="home-buch-vorschau" style={{ background: activeTheme.seite }}>
                <div className="home-buch-ruecken" style={{ background: activeTheme.ruecken }} />
                <div className="home-buch-innen">
                  <div className="home-buch-cover-strip" style={{ background: activeTheme.coverGradient }}>
                    <span style={{ color: activeTheme.coverText, fontFamily: 'Dancing Script,cursive', fontSize: '0.9rem' }}>
                      {gewaehlterEvent.emoji} {gewaehlterEvent.label}
                    </span>
                  </div>
                  <div className="home-buch-seiten-preview" style={{ borderColor: activeTheme.linie }}>
                    {[1,2,3].map(i => (
                      <div key={i} className="home-buch-linie" style={{ background: activeTheme.linie }} />
                    ))}
                    <div className="home-buch-eintrag-preview">
                      <div style={{ width: '40%', height: '6px', background: activeTheme.akzent, opacity: 0.4, borderRadius: 2 }} />
                      <div style={{ width: '70%', height: '4px', background: activeTheme.text, opacity: 0.2, borderRadius: 2, marginTop: 4 }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info + Button */}
            <div className="home-vorschau-info">
              <p className="home-vorschau-theme-name" style={{ color: activeTheme.akzent }}>
                {activeTheme.emoji} Design: <strong>{activeTheme.label}</strong>
              </p>
              <p className="home-vorschau-event-name">
                {gewaehlterEvent.emoji} {gewaehlterEvent.label}-Gästebuch
              </p>
              <button
                className="home-start-btn"
                style={{ background: activeTheme.coverGradient }}
                onClick={handleStart}
                disabled={erstelle}
              >
                {erstelle
                  ? 'Erstelle Link…'
                  : token
                    ? `${gewaehlterEvent.emoji} Link jetzt erstellen`
                    : 'Kostenlos starten →'
                }
              </button>
              {!token && (
                <p className="home-vorschau-hinweis">Kostenlos · Kein Abo · Nur E-Mail nötig</p>
              )}
              {token && (
                <p className="home-vorschau-hinweis">Du bist eingeloggt — Link wird sofort erstellt</p>
              )}
            </div>
          </div>
        )}

        {/* Link-Ergebnis wenn eingeloggt */}
        {link && (
          <div className="home-link-ergebnis" style={{ borderColor: activeTheme.akzent }}>
            <div className="home-link-header">
              <span style={{ fontSize: '1.5rem' }}>{gewaehlterEvent?.emoji}</span>
              <div>
                <p className="home-link-titel">Dein Gästebuch-Link ist fertig!</p>
                <p className="home-link-sub">{gewaehlterEvent?.label} · {activeTheme.label} Design</p>
              </div>
            </div>
            <div className="home-link-row">
              <input
                className="home-link-input"
                type="text"
                value={link}
                readOnly
                onClick={e => e.target.select()}
              />
              <button
                className="home-link-kopieren-btn"
                style={{ background: activeTheme.coverGradient }}
                onClick={handleKopieren}
              >
                {kopiert ? '✓ Kopiert!' : 'Kopieren'}
              </button>
            </div>
            <div className="home-link-actions">
              <button className="home-link-neu" onClick={() => { setLink(''); setGewaehlterEvent(null); }}>
                + Weiteres Event erstellen
              </button>
              <a className="home-link-zu-events" href="/MeineEvents">Alle meine Events →</a>
            </div>
          </div>
        )}
      </section>

      {/* Footer-Links */}
      <div className="home-footer-links">
        {token ? <a href="/MeineEvents">Meine Events</a> : <a href="/login">Anmelden</a>}
        <a href="/Impressum">Impressum</a>
        <a href="/Datenschutz">Datenschutz</a>
        <a href="/Kontakt">Kontakt</a>
      </div>
    </div>
  );
};

export default Home;
