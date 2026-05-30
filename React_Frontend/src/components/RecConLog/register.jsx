import React, { useState } from "react";
import "./RegConLog.css";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({
    username: "", vorname: "", nachname: "",
    email: "", geburtsdatum: "", adresse: "", password: "",
  });
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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMeldung(data.error || 'Fehler bei der Registrierung.'); return; }
      login(data.token, data.user);
      navigate("/Profil");
    } catch {
      setMeldung("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  const felder = [
    { label: "Benutzername", name: "username", type: "text" },
    { label: "Vorname", name: "vorname", type: "text" },
    { label: "Nachname", name: "nachname", type: "text" },
    { label: "E-Mail", name: "email", type: "email" },
    { label: "Geburtsdatum", name: "geburtsdatum", type: "date" },
    { label: "Adresse", name: "adresse", type: "text" },
    { label: "Passwort", name: "password", type: "password" },
  ];

  return (
    <div className="auth-page">
      <img className="auth-bg-book" src="/img/BraunesBuch.png" alt="" />
      <img className="auth-bg-feder" src="/img/feder.png" alt="" />

      <div className="auth-card" style={{ maxWidth: '480px' }}>
        <h1 className="auth-titel">Freundebuch</h1>
        <p className="auth-untertitel">Erstelle dein Konto</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          {felder.map(({ label, name, type }) => (
            <label key={name} className="auth-label">
              {label}
              <input className="auth-input" type={type} name={name}
                value={form[name]} onChange={handleChange} required />
            </label>
          ))}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Wird registriert…" : "Registrieren"}
          </button>
        </form>

        {meldung && <p className={`auth-meldung ${meldung.includes('fehler') || meldung.includes('Fehler') ? 'fehler' : ''}`}>{meldung}</p>}

        <p className="auth-link-zeile">
          Bereits ein Konto? <Link to="/login">Anmelden</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
