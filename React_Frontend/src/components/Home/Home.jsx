import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const FEATURES = [
  {
    emoji: "🎂",
    titel: "Events für jeden Anlass",
    text: "Geburtstag, Hochzeit, Taufe, TCG-Event oder eigene Feier — erstelle ein digitales Gästebuch in Sekunden.",
  },
  {
    emoji: "📖",
    titel: "Gäste tragen sich ein",
    text: "Schick deinen Gästen einfach einen Link. Kein Account nötig — Foto, Name und Antworten direkt eintragen.",
  },
  {
    emoji: "📸",
    titel: "Fotos & Erinnerungen",
    text: "Gäste können ein Selfie per Kamera oder Datei hochladen. Alle Einträge bleiben für immer gespeichert.",
  },
  {
    emoji: "🖨️",
    titel: "Drucken & Teilen",
    text: "Das fertige Gästebuch als PDF drucken oder einfach digital durchblättern — jederzeit und überall.",
  },
];

const EVENTS = [
  { emoji: "🎂", label: "Geburtstag" },
  { emoji: "💍", label: "Hochzeit" },
  { emoji: "⛪", label: "Taufe" },
  { emoji: "🃏", label: "TCG Event" },
  { emoji: "🎉", label: "Party" },
  { emoji: "📝", label: "Eigener Event" },
];

const Home = () => {
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
            Lass Freunde und Familie unvergessliche Einträge hinterlassen.
          </p>
          <div className="home-hero-buttons">
            <Link className="home-btn" to="/register">Jetzt kostenlos starten</Link>
            <Link className="home-btn home-btn-outline" to="/login">Anmelden</Link>
          </div>
        </div>
      </section>

      {/* Event-Typen Chips */}
      <section className="home-events-section">
        <p className="home-events-label">Perfekt für jeden Anlass</p>
        <div className="home-events-chips">
          {EVENTS.map(ev => (
            <div key={ev.label} className="home-event-chip">
              <span>{ev.emoji}</span>
              <span>{ev.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="home-features">
        {FEATURES.map((f, i) => (
          <div key={i} className="home-feature-card">
            <div className="home-feature-emoji">{f.emoji}</div>
            <h3 className="home-feature-titel">{f.titel}</h3>
            <p className="home-feature-text">{f.text}</p>
          </div>
        ))}
      </section>

      {/* Wie es funktioniert */}
      <section className="home-steps">
        <h2 className="home-steps-titel">So einfach geht's</h2>
        <div className="home-steps-liste">
          <div className="home-step">
            <div className="home-step-nr">1</div>
            <div>
              <strong>Event erstellen</strong>
              <p>Registriere dich, wähle einen Event-Typ und gib optional einen Namen und ein Datum an.</p>
            </div>
          </div>
          <div className="home-step-linie" />
          <div className="home-step">
            <div className="home-step-nr">2</div>
            <div>
              <strong>Link teilen</strong>
              <p>Kopiere den generierten Link und schick ihn per WhatsApp, Instagram oder E-Mail an deine Gäste.</p>
            </div>
          </div>
          <div className="home-step-linie" />
          <div className="home-step">
            <div className="home-step-nr">3</div>
            <div>
              <strong>Gäste tragen sich ein</strong>
              <p>Kein Account nötig — Foto aufnehmen, Fragen beantworten, fertig. In unter 2 Minuten.</p>
            </div>
          </div>
          <div className="home-step-linie" />
          <div className="home-step">
            <div className="home-step-nr">4</div>
            <div>
              <strong>Erinnerungen genießen</strong>
              <p>Alle Einträge in deiner Übersicht. Als PDF drucken oder digital durchblättern.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="home-cta">
        <h2 className="home-cta-titel">Bereit für dein erstes Gästebuch?</h2>
        <p className="home-cta-sub">Kostenlos, ohne Werbung, deine Daten gehören dir.</p>
        <Link className="home-btn home-btn-gross" to="/register">Jetzt kostenlos starten</Link>
      </section>

      {/* Footer-Links */}
      <div className="home-footer-links">
        <Link to="/Impressum">Impressum</Link>
        <Link to="/Datenschutz">Datenschutz</Link>
        <Link to="/Kontakt">Kontakt</Link>
      </div>

    </div>
  );
};

export default Home;
