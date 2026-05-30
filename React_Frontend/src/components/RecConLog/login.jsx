import React, { useState } from "react";
import "./RegConLog.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [meldung, setMeldung] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMeldung("");
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMeldung(data.error || 'Login fehlgeschlagen.'); return; }
      login(data.token, data.user);
      navigate("/Profil");
    } catch {
      setMeldung("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <img className="auth-bg-book" src="/img/BraunesBuch.png" alt="" />
      <img className="auth-bg-feder" src="/img/feder.png" alt="" />

      <div className="auth-card">
        <h1 className="auth-titel">Freundebuch</h1>
        <p className="auth-untertitel">Melde dich an</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Benutzername
            <input className="auth-input" type="text" name="username"
              value={form.username} onChange={handleChange} required autoFocus />
          </label>
          <label className="auth-label">
            Passwort
            <input className="auth-input" type="password" name="password"
              value={form.password} onChange={handleChange} required />
          </label>
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Wird angemeldet…" : "Anmelden"}
          </button>
        </form>

        {meldung && <p className={`auth-meldung ${meldung.includes('fehler') || meldung.includes('Fehler') ? 'fehler' : ''}`}>{meldung}</p>}

        <p className="auth-link-zeile">
          Noch kein Konto? <Link to="/register">Jetzt registrieren</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
