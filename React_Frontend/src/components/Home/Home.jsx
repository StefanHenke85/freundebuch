import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { EVENT_TYPEN } from "../../data/eventFragen.js";
import { THEMES, EVENT_DEFAULT_THEME } from "../../data/eventThemes.js";

const Home = () => {
  const [gewaehlterEvent, setGewaehlterEvent] = useState(null);
  const [gewaehlterTheme, setGewaehlterTheme] = useState(null);
  const navigate = useNavigate();

  const handleEventWahl = (typ) => {
    setGewaehlterEvent(typ);
    setGewaehlterTheme(EVENT_DEFAULT_THEME[typ.id] || 'braun');
  };

  const handleStart = () => {
    const params = new URLSearchParams({
      event: gewaehlterEvent.id,
      name: gewaehlterEvent.label,
      theme: gewaehlterTheme,
    });
    navigate(`/register?${params.toString()}`);
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
            <a className="home-btn home-btn-outline" href="/login">Anmelden</a>
          </div>
        </div>
      </section>

      {/* Schritt-für-Schritt */}
      <section className="home-steps">
        <h2 className="home-steps-titel">So einfach geht's</h2>
        <div className="home-steps-liste">
          {[
            { nr: '1', titel: 'Event wählen', text: 'Wähle einen Anlass und ein Design das zu dir passt.' },
            { nr: '2', titel: 'Registrieren', text: 'Nur E-Mail und Passwort — in 10 Sekunden fertig.' },
            { nr: '3', titel: 'Link teilen', text: 'Schick den Link per WhatsApp, Instagram oder E-Mail.' },
            { nr: '4', titel: 'Einträge sammeln', text: 'Gäste tragen sich ein — mit Foto, Name und Antworten.' },
          ].map((s, i, arr) => (
            <React.Fragment key={i}>
              <div className="home-step">
                <div className="home-step-nr">{s.nr}</div>
                <div>
                  <strong>{s.titel}</strong>
                  <p>{s.text}</p>
                </div>
              </div>
              {i < arr.length - 1 && <div className="home-step-linie" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Event-Vorauswahl + Theme */}
      <section className="home-erstellen" id="erstellen">
        <h2 className="home-erstellen-titel">Dein Gästebuch in 3 Klicks</h2>

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
                  onClick={() => setGewaehlterTheme(t.id)}
                  title={t.label}
                >
                  <div className="home-theme-vorschau">
                    <div style={{ background: t.vorschau[0], flex: 1, borderRadius: '4px 4px 0 0' }} />
                    <div style={{ background: t.vorschau[1], flex: 2 }} />
                    <div style={{ background: t.vorschau[2], height: '4px' }} />
                  </div>
                  <span className="home-theme-label">{t.emoji} {t.label}</span>
                  {gewaehlterTheme === t.id && <span className="home-theme-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schritt 3: Vorschau + Start */}
        {gewaehlterEvent && gewaehlterTheme && (
          <div className="home-vorschau">
            <div
              className="home-buch-vorschau"
              style={{
                background: activeTheme.seite,
                borderLeft: `14px solid`,
                borderImage: activeTheme.ruecken + ' 1',
              }}
            >
              <div
                className="home-buch-cover-strip"
                style={{ background: activeTheme.coverGradient }}
              >
                <span style={{ color: activeTheme.coverText, fontFamily: 'Dancing Script, cursive', fontSize: '1rem' }}>
                  {gewaehlterEvent.emoji} {gewaehlterEvent.label}
                </span>
              </div>
              <div className="home-buch-seite-vorschau" style={{ borderColor: activeTheme.linie }}>
                <div className="home-buch-linie" style={{ background: activeTheme.linie }} />
                <div className="home-buch-linie" style={{ background: activeTheme.linie }} />
                <div className="home-buch-linie" style={{ background: activeTheme.linie }} />
              </div>
            </div>
            <div className="home-vorschau-info">
              <p style={{ color: activeTheme.frage, fontWeight: 'bold', margin: '0 0 0.3rem' }}>
                {activeTheme.emoji} Design: {activeTheme.label}
              </p>
              <p style={{ color: '#c4a882', fontSize: '0.85rem', margin: '0 0 1rem' }}>
                Für dein {gewaehlterEvent.label}-Gästebuch
              </p>
              <button
                className="home-start-btn"
                style={{ background: activeTheme.coverGradient }}
                onClick={handleStart}
              >
                Jetzt loslegen →
              </button>
              <p className="home-vorschau-hinweis">Kostenlos · Kein Abo · Deine Daten</p>
            </div>
          </div>
        )}
      </section>

      {/* Footer-Links */}
      <div className="home-footer-links">
        <a href="/login">Anmelden</a>
        <a href="/Impressum">Impressum</a>
        <a href="/Datenschutz">Datenschutz</a>
        <a href="/Kontakt">Kontakt</a>
      </div>
    </div>
  );
};

export default Home;
