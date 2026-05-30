import React, { useState } from "react";
import "./RegConLog.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [meldung, setMeldung] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // Event-Vorauswahl aus URL-Param
  const params = new URLSearchParams(window.location.search);
  const eventTyp = params.get('event') || '';
  const eventName = params.get('name') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) { setMeldung('Passwörter stimmen nicht überein.'); return; }
    if (password.length < 6) { setMeldung('Passwort muss mindestens 6 Zeichen lang sein.'); return; }
    setLoading(true);
    setMeldung('');
    try {
      const res = await fetch('/api/auth?action=register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setMeldung(data.error || 'Fehler bei der Registrierung.'); return; }
      login(data.token, data.user);
      // Wenn von Landing Page mit Event-Vorauswahl → direkt Event erstellen
      if (eventTyp) {
        navigate(`/event-erstellen?typ=${eventTyp}&name=${encodeURIComponent(eventName)}`);
      } else {
        navigate('/Profil');
      }
    } catch { setMeldung('Verbindungsfehler. Bitte erneut versuchen.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <img className="auth-bg-book" src="/img/BraunesBuch.png" alt="" />
      <img className="auth-bg-feder" src="/img/feder.png" alt="" />
      <div className="auth-card">
        <h1 className="auth-titel">Freundebuch</h1>
        <p className="auth-untertitel">
          {eventTyp ? `Konto erstellen für dein ${eventName || eventTyp}-Gästebuch` : 'Kostenloses Konto erstellen'}
        </p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            E-Mail-Adresse
            <input className="auth-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="du@beispiel.de" required autoFocus />
          </label>
          <label className="auth-label">
            Passwort <span style={{ fontStyle: 'normal', color: '#a0856a' }}>(mind. 6 Zeichen)</span>
            <input className="auth-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          <label className="auth-label">
            Passwort wiederholen
            <input className="auth-input" type="password" value={password2}
              onChange={e => setPassword2(e.target.value)} placeholder="••••••••" required />
          </label>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Wird registriert…' : 'Kostenlos registrieren'}
          </button>
        </form>
        {meldung && <p className={`auth-meldung ${meldung.includes('stimmen') || meldung.includes('Fehler') ? 'fehler' : ''}`}>{meldung}</p>}
        <p className="auth-link-zeile">Bereits ein Konto? <Link to="/login">Anmelden</Link></p>
      </div>
    </div>
  );
};

export default Register;
