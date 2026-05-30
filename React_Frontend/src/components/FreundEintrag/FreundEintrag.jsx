import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import './FreundEintrag.css';

const FreundEintrag = () => {
  const { linkId } = useParams();
  const [daten, setDaten] = useState(null);
  const [fehler, setFehler] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [antworten, setAntworten] = useState({});
  const [foto, setFoto] = useState(null);
  const [kameraAktiv, setKameraAktiv] = useState(false);
  const [kameraFehler, setKameraFehler] = useState('');
  const [schritt, setSchritt] = useState('laden');
  const [aktiveSeite, setAktiveSeite] = useState(0);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetch(`/api/eintrag?linkId=${linkId}`)
      .then(r => r.json())
      .then(d => {
        if (d.error) { setFehler(d.error); setSchritt('fehler'); return; }
        setDaten(d);
        setSchritt('ausfuellen');
      })
      .catch(() => { setFehler('Verbindungsfehler.'); setSchritt('fehler'); });
  }, [linkId]);

  useEffect(() => {
    if (kameraAktiv && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [kameraAktiv]);

  const kameraStarten = useCallback(async () => {
    setKameraFehler('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      setKameraAktiv(true);
    } catch (err) {
      setKameraFehler('Kamera nicht verfügbar.');
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
    canvas.width = video.videoWidth || 400;
    canvas.height = video.videoHeight || 300;
    canvas.getContext('2d').drawImage(video, 0, 0);
    setFoto(canvas.toDataURL('image/jpeg', 0.7));
    kameraStoppen();
  }, [kameraStoppen]);

  const handleDatei = (e) => {
    const datei = e.target.files[0];
    if (!datei) return;
    const reader = new FileReader();
    reader.onload = ev => setFoto(ev.target.result);
    reader.readAsDataURL(datei);
  };

  const handleSenden = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const antwortListe = daten.fragen.map(f => ({ frage: f, antwort: antworten[f] || '' }));
    const res = await fetch(`/api/eintrag?linkId=${linkId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ freund_name: name, freund_email: email, antworten: antwortListe, foto }),
    });
    if (res.ok) setSchritt('danke');
    else setFehler('Fehler beim Speichern.');
  };

  if (schritt === 'laden') return <div className="fe-wrapper"><p className="fe-laden">Lade…</p></div>;
  if (schritt === 'fehler') return <div className="fe-wrapper"><p className="fe-fehler">{fehler}</p></div>;

  if (schritt === 'danke') return (
    <div className="fe-wrapper">
      <div className="fe-karte fe-danke">
        <h1 className="fe-titel">Danke! 🎉</h1>
        <p className="fe-text">Du bist jetzt im Freundebuch von <strong>{daten?.besitzer}</strong> eingetragen.</p>
        <p className="fe-text">Möchtest du auch ein eigenes Freundebuch erstellen?</p>
        <Link className="fe-btn" to="/register">Jetzt registrieren</Link>
      </div>
    </div>
  );

  const SEITE_GROESSE = 6;
  const seiten = daten ? Array.from(
    { length: Math.ceil((daten.fragen?.length || 0) / SEITE_GROESSE) },
    (_, i) => (daten.fragen || []).slice(i * SEITE_GROESSE, (i + 1) * SEITE_GROESSE)
  ) : [];
  const letzteSeite = aktiveSeite === seiten.length;

  return (
    <div className="fe-wrapper">
      <div className="fe-buch">

        {/* Linke Seite */}
        <div className="fe-links">
          <h2 className="fe-buch-titel">Freundebuch</h2>
          <p className="fe-besitzer">von <strong>{daten.besitzer}</strong></p>

          {/* Foto-Bereich immer sichtbar */}
          <div className="fe-foto-bereich">
            {foto
              ? <img src={foto} alt="Dein Foto" className="fe-foto-vorschau" />
              : <div className="fe-foto-platzhalter">📷</div>
            }

            {kameraAktiv ? (
              <div className="fe-kamera">
                <video ref={videoRef} autoPlay playsInline muted className="fe-kamera-video" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="fe-kamera-buttons">
                  <button type="button" className="fe-btn" onClick={fotoMachen}>📸 Foto</button>
                  <button type="button" className="fe-btn fe-btn-grau" onClick={kameraStoppen}>✕</button>
                </div>
              </div>
            ) : (
              <div className="fe-foto-optionen">
                <button type="button" className="fe-btn fe-btn-klein" onClick={kameraStarten}>📷 Kamera</button>
                <label className="fe-btn fe-btn-klein">
                  🖼 Datei
                  <input type="file" accept="image/*" onChange={handleDatei} style={{ display: 'none' }} />
                </label>
                {foto && (
                  <button type="button" className="fe-btn fe-btn-grau fe-btn-klein" onClick={() => setFoto(null)}>✕ Entfernen</button>
                )}
              </div>
            )}
            {kameraFehler && <p className="fe-kamera-fehler">{kameraFehler}</p>}
          </div>

          {aktiveSeite === 0 && (
            <div className="fe-name-bereich">
              <label className="fe-label">
                Dein Name *
                <input className="fe-input" type="text" value={name}
                  onChange={e => setName(e.target.value)} placeholder="Wie heißt du?" />
              </label>
              <label className="fe-label">
                E-Mail (optional)
                <input className="fe-input" type="email" value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="für Benachrichtigungen" />
              </label>
            </div>
          )}

          {daten.eintraege.length > 0 && (
            <div className="fe-eintraege">
              <p className="fe-eintraege-titel">Bereits eingetragen:</p>
              <div className="fe-chips">
                {daten.eintraege.slice(0, 5).map((e, i) => (
                  <div key={i} className="fe-freund-chip">
                    {e.foto
                      ? <img src={e.foto} alt={e.freund_name} className="fe-chip-foto" />
                      : <span className="fe-chip-initial">{e.freund_name.charAt(0).toUpperCase()}</span>
                    }
                    <span>{e.freund_name}</span>
                  </div>
                ))}
                {daten.eintraege.length > 5 && (
                  <div className="fe-freund-chip">+{daten.eintraege.length - 5}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Rechte Seite: Fragen */}
        <div className="fe-rechts">
          {!letzteSeite ? (
            <>
              <p className="fe-seite-nr">Seite {aktiveSeite + 1} / {seiten.length}</p>
              <div className="fe-fragen">
                {seiten[aktiveSeite].map((frage, i) => (
                  <label key={i} className="fe-frage-label">
                    <span className="fe-frage-text">{frage}</span>
                    <input className="fe-frage-input" type="text"
                      value={antworten[frage] || ''}
                      onChange={e => setAntworten({ ...antworten, [frage]: e.target.value })}
                      placeholder="Deine Antwort…" />
                  </label>
                ))}
                <button type="button" className="fe-btn fe-btn-weiter" onClick={() => setAktiveSeite(aktiveSeite + 1)}>
                  Weiter →
                </button>
              </div>
            </>
          ) : (
            <form className="fe-abschluss" onSubmit={handleSenden}>
              <p className="fe-abschluss-text">
                Fast fertig! {!foto && <span className="fe-foto-hinweis">Tipp: Füge links noch ein Foto hinzu 📷</span>}
              </p>
              {fehler && <p className="fe-fehler">{fehler}</p>}
              <div className="fe-abschluss-buttons">
                <button type="button" className="fe-btn fe-btn-grau" onClick={() => setAktiveSeite(aktiveSeite - 1)}>← Zurück</button>
                <button type="submit" className="fe-btn" disabled={!name.trim()}>📖 Eintragen</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreundEintrag;
