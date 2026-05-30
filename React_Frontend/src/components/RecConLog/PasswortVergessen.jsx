import React, { useState } from "react";
import "./RegConLog.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const PasswortVergessen = () => {
  const [schritt, setSchritt] = useState('email'); // email | code | fertig
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeAnzeige, setCodeAnzeige] = useState(''); // Demo: Code anzeigen
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [meldung, setMeldung] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAnfordern = async (e) => {
    e.preventDefault();
    setLoading(true); setMeldung('');
    try {
      const res = await fetch('/api/auth?action=forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setMeldung(data.error || 'Fehler.'); return; }
      setCodeAnzeige(data.token || '');
      setSchritt('code');
    } catch { setMeldung('Verbindungsfehler.'); }
    finally { setLoading(false); }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== password2) { setMeldung('Passwörter stimmen nicht überein.'); return; }
    setLoading(true); setMeldung('');
    try {
      const res = await fetch('/api/auth?action=reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: code, password }),
      });
      const data = await res.json();
      if (!res.ok) { setMeldung(data.error || 'Fehler.'); return; }
      login(data.token, data.user);
      navigate('/MeineEvents');
    } catch { setMeldung('Verbindungsfehler.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <img className="auth-bg-book" src="/img/BraunesBuch.png" alt="" />
      <div className="auth-card">
        <h1 className="auth-titel">Freundebuch</h1>

        {schritt === 'email' && (
          <>
            <p className="auth-untertitel">Passwort zurücksetzen</p>
            <form className="auth-form" onSubmit={handleAnfordern}>
              <label className="auth-label">
                Deine E-Mail-Adresse
                <input className="auth-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="du@beispiel.de" required autoFocus />
              </label>
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? 'Wird gesendet…' : 'Reset-Code anfordern'}
              </button>
            </form>
          </>
        )}

        {schritt === 'code' && (
          <>
            <p className="auth-untertitel">Neues Passwort setzen</p>
            {codeAnzeige && (
              <div className="auth-code-box">
                <p className="auth-code-label">Dein Reset-Code:</p>
                <p className="auth-code-wert">{codeAnzeige}</p>
                <p className="auth-code-hinweis">Gültig 30 Minuten</p>
              </div>
            )}
            <form className="auth-form" onSubmit={handleReset}>
              <label className="auth-label">
                Reset-Code
                <input className="auth-input" type="text" value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())} placeholder="z.B. A1B2C3D4" required />
              </label>
              <label className="auth-label">
                Neues Passwort
                <input className="auth-input" type="password" value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
              </label>
              <label className="auth-label">
                Passwort wiederholen
                <input className="auth-input" type="password" value={password2}
                  onChange={e => setPassword2(e.target.value)} placeholder="••••••••" required />
              </label>
              <button className="auth-btn" type="submit" disabled={loading}>
                {loading ? 'Wird gespeichert…' : 'Passwort ändern'}
              </button>
            </form>
          </>
        )}

        {meldung && <p className="auth-meldung fehler">{meldung}</p>}
        <p className="auth-link-zeile"><Link to="/login">← Zurück zum Login</Link></p>
      </div>
    </div>
  );
};

export default PasswortVergessen;
