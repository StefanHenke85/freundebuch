import React, { useState } from "react";
import "./RegConLog.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [meldung, setMeldung] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setMeldung('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setMeldung(data.error || 'Login fehlgeschlagen.'); return; }
      login(data.token, data.user);
      navigate('/MeineEvents');
    } catch { setMeldung('Verbindungsfehler. Bitte erneut versuchen.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <img className="auth-bg-book" src="/img/BraunesBuch.png" alt="" />
      <img className="auth-bg-feder" src="/img/feder.png" alt="" />
      <div className="auth-card">
        <h1 className="auth-titel">Freundebuch</h1>
        <p className="auth-untertitel">Willkommen zurück</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            E-Mail-Adresse
            <input className="auth-input" type="email" value={email}
              onChange={e => setEmail(e.target.value)} placeholder="du@beispiel.de" required autoFocus />
          </label>
          <label className="auth-label">
            Passwort
            <input className="auth-input" type="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Wird angemeldet…' : 'Anmelden'}
          </button>
        </form>
        {meldung && <p className="auth-meldung fehler">{meldung}</p>}
        <div className="auth-links-row">
          <Link to="/passwort-vergessen" className="auth-link-klein">Passwort vergessen?</Link>
          <Link to="/register">Neu registrieren</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
