import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Profil-Design.css";

const Profil1 = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ wohnort: '', telefon: '', beschreibung: '' });
  const [gespeichert, setGespeichert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profilbild, setProfilbild] = useState(null);
  const [kameraAktiv, setKameraAktiv] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/api/profil', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setForm({ wohnort: data.wohnort || '', telefon: data.telefon || '', beschreibung: data.beschreibung || '' });
        if (data.profilbild) setProfilbild(data.profilbild);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const gespeichertBild = localStorage.getItem('fb_profilbild');
    if (gespeichertBild) setProfilbild(gespeichertBild);
  }, [token, navigate]);

  const handleDateiWahl = (e) => {
    const datei = e.target.files[0];
    if (!datei) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfilbild(ev.target.result);
      localStorage.setItem('fb_profilbild', ev.target.result);
    };
    reader.readAsDataURL(datei);
  };

  const kameraStarten = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setKameraAktiv(true);
    } catch {
      alert('Kamera konnte nicht geöffnet werden.');
    }
  }, []);

  const kameraStoppen = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setKameraAktiv(false);
  }, []);

  const fotoMachen = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const bild = canvas.toDataURL('image/jpeg', 0.8);
    setProfilbild(bild);
    localStorage.setItem('fb_profilbild', bild);
    kameraStoppen();
  }, [kameraStoppen]);

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
    <div className="profil-buch-wrapper">
      <div className="profil-buch">
        {/* Linke Seite: Bild + Infos */}
        <div className="profil-links">
          <div className="profil-bild-bereich">
            {profilbild
              ? <img src={profilbild} alt="Profilbild" className="profil-bild-vorschau" />
              : <div className="profil-bild-platzhalter">📷</div>
            }

            {kameraAktiv ? (
              <div className="kamera-bereich">
                <video ref={videoRef} autoPlay playsInline className="kamera-video" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="kamera-buttons">
                  <button type="button" className="profil-btn" onClick={fotoMachen}>📸 Foto machen</button>
                  <button type="button" className="profil-btn profil-btn-grau" onClick={kameraStoppen}>Abbrechen</button>
                </div>
              </div>
            ) : (
              <div className="bild-optionen">
                <button type="button" className="profil-btn" onClick={kameraStarten}>📷 Kamera</button>
                <label className="profil-btn">
                  🖼 Datei wählen
                  <input type="file" accept="image/*" onChange={handleDateiWahl} style={{ display: 'none' }} />
                </label>
              </div>
            )}
          </div>

          <div className="profil-infos">
            <p className="profil-zeile">
              <span>Name:</span>
              <strong>{user?.vorname} {user?.nachname}</strong>
            </p>
            <p className="profil-zeile">
              <span>Wohnort:</span>
              <input className="profil-input" type="text" value={form.wohnort}
                onChange={e => setForm({ ...form, wohnort: e.target.value })} placeholder="Wohnort" />
            </p>
            <p className="profil-zeile">
              <span>Telefon:</span>
              <input className="profil-input" type="text" value={form.telefon}
                onChange={e => setForm({ ...form, telefon: e.target.value })} placeholder="Telefon" />
            </p>
            <p className="profil-zeile">
              <span>Geburtstag:</span>
              <strong>{user?.geburtsdatum || '—'}</strong>
            </p>
          </div>
        </div>

        {/* Rechte Seite: Über mich */}
        <div className="profil-rechts">
          <h2 className="profil-ueber-titel">Über mich</h2>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <textarea
              className="profil-textarea"
              placeholder="Schreib etwas über dich..."
              value={form.beschreibung}
              onChange={e => setForm({ ...form, beschreibung: e.target.value })}
            />
            <div style={{ marginTop: 'auto', textAlign: 'center' }}>
              {gespeichert && <p className="profil-gespeichert">✓ Gespeichert</p>}
              <button type="submit" className="profil-btn profil-btn-speichern">Speichern</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profil1;
