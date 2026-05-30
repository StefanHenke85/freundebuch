import React, { useState } from "react";
import "./RegConLog.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
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
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setMessage(data.error || 'Login fehlgeschlagen.'); return; }
      login(data.token, data.user);
      setMessage("Login erfolgreich! Du wirst weitergeleitet...");
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
        <img className="Book-Background2" src="/img/book.png" alt="Book Background" />
        <img className="feder2" src="/img/feder.png" alt="Feder" />
      </div>
      <div className="register-container1">
        <h1 className="Headline1">Login</h1>
        <form className="register-form" onSubmit={handleSubmit}>
          <label htmlFor="username">
            Benutzername:
            <input
              className="input-field"
              type="text"
              id="username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="password">
            Passwort:
            <input
              className="input-field"
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Wird eingeloggt..." : "Login"}
          </button>
        </form>
        {message && <p className="message">{message}</p>}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Noch kein Konto? <a href="/register">Jetzt registrieren</a>
        </p>
      </div>
    </main>
  );
};

export default Login;
