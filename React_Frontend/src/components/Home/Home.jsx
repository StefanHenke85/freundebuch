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
  const [schritt, setSchritt] = useState(1); // 1=event, 2=theme, 3=fertig

  const handleEventWahl = (typ) => {
    setGewaehlterEvent(typ);
    setGewaehlterTheme(EVENT_DEFAULT_THEME[typ.id] || 'braun');
    setSchritt(2);
    setLink('');
  };

  const handleThemeWahl = (id) => {
    setGewaehlterTheme(id);
  };

  const handleStart = async () => {
    if (!gewaehlterEvent || !gewaehlterTheme) return;

    if (!token) {
      const params = new URLSearchParams({
        event: gewaehlterEvent.id,
        name: gewaehlterEvent.label,
        theme: gewaehlterTheme,
      });
      navigate(`/register?${params.toString()}`);
      return;
    }

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
      setSchritt(3);
    } catch {
      alert('Fehler beim Erstellen.');
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
      {/* Links: Info-Panel */}
      <aside className="home-info">
        <div className="home-info-top">
          <h1 className="home-logo-titel">📖 Freundebuch</h1>
          <p className="home-tagline">Digitales Gästebuch für jeden Anlass</p>
        </div>

        <div className="home-info-features">
          {[
            { emoji: '🎨', text: '10 Design-Themes' },
            { emoji: '📸', text: 'Fotos & Selfies' },
            { emoji: '🔗', text: 'Kein Account für Gäste' },
            { emoji: '🖨️', text: 'Drucken & PDF' },
            { emoji: '📱', text: 'Auf jedem Gerät' },
            { emoji: '🔒', text: 'Kostenlos & privat' },
          ].map((f, i) => (
            <div key={i} className="home-feature-pill">
              <span>{f.emoji}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>

        <div className="home-info-steps">
          {[
            { nr: '1', text: 'Event & Design wählen' },
            { nr: '2', text: token ? 'Link sofort erstellen' : 'Kurz registrieren' },
            { nr: '3', text: 'Link teilen & Einträge sammeln' },
          ].map((s, i) => (
            <div key={i} className="home-mini-step">
              <span className="home-mini-step-nr">{s.nr}</span>
              <span className="home-mini-step-text">{s.text}</span>
            </div>
          ))}
        </div>

        <div className="home-info-bottom">
          {token
            ? <a href="/MeineEvents" className="home-info-link">Meine Events →</a>
            : <>
                <a href="/login" className="home-info-link">Bereits registriert? Anmelden</a>
              </>
          }
          <div className="home-footer-mini">
            <a href="/Impressum">Impressum</a>
            <a href="/Datenschutz">Datenschutz</a>
            <a href="/Kontakt">Kontakt</a>
          </div>
        </div>
      </aside>

      {/* Rechts: Konfigurator */}
      <main className="home-konfigurator">

        {/* Schritt-Indikatoren */}
        <div className="home-konfig-schritte">
          <div className={`home-konfig-schritt ${schritt >= 1 ? 'aktiv' : ''} ${schritt > 1 ? 'fertig' : ''}`}
            onClick={() => schritt > 1 && setSchritt(1)}>
            {schritt > 1 ? '✓' : '1'} Anlass
          </div>
          <div className="home-konfig-linie" />
          <div className={`home-konfig-schritt ${schritt >= 2 ? 'aktiv' : ''} ${schritt > 2 ? 'fertig' : ''}`}
            onClick={() => schritt > 2 && setSchritt(2)}>
            {schritt > 2 ? '✓' : '2'} Design
          </div>
          <div className="home-konfig-linie" />
          <div className={`home-konfig-schritt ${schritt >= 3 ? 'aktiv' : ''}`}>
            3 Fertig
          </div>
        </div>

        {/* Schritt 1: Event wählen */}
        {schritt === 1 && (
          <div className="home-konfig-panel">
            <h2 className="home-konfig-titel">Für welchen Anlass?</h2>
            <div className="home-event-grid">
              {EVENT_TYPEN.map(typ => (
                <button
                  key={typ.id}
                  className={`home-event-btn ${gewaehlterEvent?.id === typ.id ? 'aktiv' : ''}`}
                  style={gewaehlterEvent?.id === typ.id ? { borderColor: typ.farbe, background: typ.farbe + '22' } : {}}
                  onClick={() => handleEventWahl(typ)}
                >
                  <span className="home-event-emoji">{typ.emoji}</span>
                  <span className="home-event-label">{typ.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schritt 2: Design + Vorschau */}
        {schritt === 2 && (
          <div className="home-konfig-panel">
            <h2 className="home-konfig-titel">
              {gewaehlterEvent?.emoji} {gewaehlterEvent?.label} — Design wählen
            </h2>
            <div className="home-konfig-mitte">
              {/* Theme-Grid links */}
              <div className="home-theme-grid">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    className={`home-theme-btn ${gewaehlterTheme === t.id ? 'aktiv' : ''}`}
                    onClick={() => handleThemeWahl(t.id)}
                    title={t.label}
                  >
                    <div className="home-theme-vorschau">
                      <div style={{ background: t.vorschau[0], flex: '0 0 30%', borderRadius: '3px 0 0 3px' }} />
                      <div style={{ background: t.vorschau[1], flex: 1 }} />
                    </div>
                    <span className="home-theme-label">{t.emoji} {t.label}</span>
                    {gewaehlterTheme === t.id && <span className="home-theme-check">✓</span>}
                  </button>
                ))}
              </div>

              {/* Buch-Vorschau rechts */}
              <div className="home-buch-preview">
                <div className="home-buch-3d" style={{ '--buch-cover': activeTheme.coverGradient, '--buch-seite': activeTheme.seite, '--buch-ruecken': activeTheme.ruecken, '--buch-linie': activeTheme.linie, '--buch-akzent': activeTheme.akzent, '--buch-text': activeTheme.coverText }}>
                  <div className="home-buch-3d-ruecken" />
                  <div className="home-buch-3d-vorderseite">
                    <div className="home-buch-3d-cover">
                      <span className="home-buch-3d-cover-emoji">{gewaehlterEvent?.emoji}</span>
                      <span className="home-buch-3d-cover-titel">{gewaehlterEvent?.label}</span>
                    </div>
                    <div className="home-buch-3d-seite">
                      <div className="home-buch-3d-linie" />
                      <div className="home-buch-3d-linie" />
                      <div className="home-buch-3d-linie short" />
                      <div className="home-buch-3d-eintrag">
                        <div className="home-buch-3d-eintrag-dot" />
                        <div className="home-buch-3d-eintrag-text" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="home-buch-preview-label">
                  {activeTheme.emoji} <strong>{activeTheme.label}</strong>
                </p>
                <button
                  className="home-konfig-weiter-btn"
                  style={{ background: activeTheme.coverGradient }}
                  onClick={handleStart}
                  disabled={erstelle}
                >
                  {erstelle
                    ? '⏳ Erstelle…'
                    : token
                      ? `${gewaehlterEvent?.emoji} Link erstellen`
                      : 'Kostenlos starten →'
                  }
                </button>
                {!token && (
                  <p className="home-konfig-hinweis">Nur E-Mail + Passwort — 10 Sekunden</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Schritt 3: Link fertig */}
        {schritt === 3 && (
          <div className="home-konfig-panel home-konfig-erfolg">
            <div className="home-erfolg-icon">{gewaehlterEvent?.emoji}</div>
            <h2 className="home-konfig-titel">Dein Gästebuch ist bereit!</h2>
            <p className="home-erfolg-sub">
              {gewaehlterEvent?.label} · {activeTheme.emoji} {activeTheme.label} Design
            </p>

            <div className="home-link-box">
              <input
                className="home-link-input"
                type="text"
                value={link}
                readOnly
                onClick={e => e.target.select()}
              />
              <button
                className="home-link-copy-btn"
                style={{ background: activeTheme.coverGradient }}
                onClick={handleKopieren}
              >
                {kopiert ? '✓ Kopiert!' : '📋 Kopieren'}
              </button>
            </div>

            <p className="home-link-hinweis">
              Schick diesen Link an deine Gäste — sie können sofort eintragen, kein Account nötig!
            </p>

            <div className="home-erfolg-actions">
              <button className="home-erfolg-neu" onClick={() => { setSchritt(1); setGewaehlterEvent(null); setLink(''); }}>
                + Weiteres Event erstellen
              </button>
              <a href="/MeineEvents" className="home-erfolg-events">Alle Events verwalten →</a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
