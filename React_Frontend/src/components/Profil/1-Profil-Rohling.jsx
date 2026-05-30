import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Profil-Design.css";

const Profil1 = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ wohnort: '', telefon: '', beschreibung: '' });
  const [gespeichert, setGespeichert] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/api/profil', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setForm({
          wohnort: data.wohnort || '',
          telefon: data.telefon || '',
          beschreibung: data.beschreibung || '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, navigate]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/profil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      setGespeichert(true);
      setTimeout(() => setGespeichert(false), 2500);
    } catch {
      alert('Fehler beim Speichern.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Laden...</div>;

  return (
    <div className="book2">
      <img id="bookProfil" src="/img/book.png" alt="book" />

      <div className="left-page">
        <div className="image-placeholder">
          <label id="file2" htmlFor="file">Bild einfügen</label>
          <input type="file" id="file" />
        </div>

        <p className="pProfil">
          Hallo! Mein Name ist <strong>{user?.vorname} {user?.nachname}</strong>.
        </p>

        <p className="pProfil">
          Ich wohne in{' '}
          <input
            type="text"
            className="input1"
            value={form.wohnort}
            onChange={e => setForm({ ...form, wohnort: e.target.value })}
            placeholder="Wohnort"
          />.
        </p>

        <p className="pProfil">
          Meine Telefonnummer ist{' '}
          <input
            type="text"
            className="input1"
            value={form.telefon}
            onChange={e => setForm({ ...form, telefon: e.target.value })}
            placeholder="Telefon"
          />.
        </p>

        <p className="pProfil">
          Ich habe Geburtstag am <strong>{user?.geburtsdatum || '?'}</strong>.
        </p>
      </div>

      <div id="rightPage">
        <h1 id="ÜberMich">Über Mich</h1>
        <form onSubmit={handleSave}>
          <textarea
            name="beschreibung"
            id="description"
            placeholder="Beschreibung"
            value={form.beschreibung}
            onChange={e => setForm({ ...form, beschreibung: e.target.value })}
          />
          <button id="savingdescription" type="submit">Speichern</button>
        </form>
        {gespeichert && <p style={{ color: 'green', textAlign: 'center' }}>Gespeichert!</p>}
        <img id="federProfil" src="/img/feder.png" alt="feder" />
      </div>
    </div>
  );
};

export default Profil1;
