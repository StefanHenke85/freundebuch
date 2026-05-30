import React, { useState } from "react";
import "./RegConLog.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({
    username: "", vorname: "", nachname: "",
    email: "", geburtsdatum: "", adresse: "", password: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || 'Fehler bei der Registrierung.'); return; }
      login(data.token, data.user);
      setMessage("Registrierung erfolgreich! Du wirst weitergeleitet...");
      setTimeout(() => navigate("/Profil"), 1500);
    } catch {
      setMessage("Verbindungsfehler. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="main-content1">
      <div>
        <img className="Book-Background1" src="/img/book.png" alt="Book Background" />
        <img className="feder1" src="/img/feder.png" alt="Feder" />
      </div>
      <div className="register-container">
        <h1 className="Headline1">Registrieren</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          {[
            { label: "Benutzername", name: "username", type: "text" },
            { label: "Vorname", name: "vorname", type: "text" },
            { label: "Nachname", name: "nachname", type: "text" },
            { label: "E-Mail", name: "email", type: "email" },
            { label: "Geburtsdatum", name: "geburtsdatum", type: "date" },
            { label: "Adresse", name: "adresse", type: "text" },
            { label: "Passwort", name: "password", type: "password" },
          ].map(({ label, name, type }) => (
            <label key={name} htmlFor={name}>
              {label}:
              <input
                className="input-field"
                type={type}
                id={name}
                name={name}
                value={form[name]}
                onChange={handleChange}
                required
              />
            </label>
          ))}
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Wird registriert..." : "Registrieren"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </main>
  );
};

export default Register;
