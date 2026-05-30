import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { EVENT_FRAGEN, getEventTyp } from '../../data/eventFragen.js';
import { getTheme, getThemeById } from '../../data/eventThemes.js';
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
    } catch { setKameraFehler('Kamera nicht verfügbar.'); }
  }, []);

  const kameraStoppen = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
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
    const antwortListe = fragen.map(f => ({ frage: f, antwort: antworten[f] || '' }));
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

  const eventTyp = getEventTyp(daten?.event_typ);
  // Theme aus DB (gespeichertes theme_id), Fallback auf Event-Default
  const theme = daten?.theme_id ? getThemeById(daten.theme_id) : getTheme(daten?.event_typ);
  const fragen = EVENT_FRAGEN[eventTyp.id] || EVENT_FRAGEN.eigener;
  const SEITE_GROESSE = 6;
  const seiten = Array.from(
    { length: Math.ceil(fragen.length / SEITE_GROESSE) },
    (_, i) => fragen.slice(i * SEITE_GROESSE, (i + 1) * SEITE_GROESSE)
  );
  const letzteSeite = aktiveSeite === seiten.length;

  const eventTitel = daten.event_name || `${eventTyp.emoji} ${eventTyp.label}`;
  const eventDatumFormatiert = daten.event_datum
    ? new Date(daten.event_datum).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })
    : null;

  if (schritt === 'danke') return (
    <div className="fe-wrapper" style={{ '--event-farbe': eventTyp.farbe }}>
      <div className="fe-karte fe-danke">
        <div className="fe-danke-emoji">{eventTyp.emoji}</div>
        <h1 className="fe-titel">Danke!</h1>
        <p className="fe-text">Du bist jetzt im Gästebuch von <strong>{daten.besitzer}</strong> eingetragen.</p>
        <p className="fe-text" style={{ fontSize: '0.85rem', color: '#8b5e3c' }}>{eventTitel}</p>
        <div style={{ height: '1px', background: '#d4b896', margin: '1rem 0' }} />
        <p className="fe-text">Möchtest du auch ein eigenes Gästebuch erstellen?</p>
        <Link className="fe-btn" to="/register" style={{ background: eventTyp.farbe }}>Jetzt registrieren</Link>
      </div>
    </div>
  );

  const themeVars = {
    '--fe-cover':       theme.cover,
    '--fe-cover-text':  theme.coverText,
    '--fe-seite':       theme.seite,
    '--fe-linie':       theme.linie,
    '--fe-akzent':      theme.akzent,
    '--fe-text':        theme.text,
    '--fe-frage':       theme.frage,
    '--fe-ruecken':     theme.ruecken,
    '--event-farbe':    eventTyp.farbe,
    'background':       theme.hintergrund,
  };

  return (
    <div className="fe-wrapper" style={themeVars}>
      <div className="fe-buch" style={{ '--fe-ruecken': theme.ruecken }}>

        {/* Linke Seite */}
        <div className="fe-links">
          {/* Event-Header */}
          <div className="fe-event-header" style={{ borderColor: eventTyp.farbe }}>
            <span className="fe-event-emoji">{eventTyp.emoji}</span>
            <div>
              <p className="fe-event-name">{eventTitel}</p>
              <p className="fe-besitzer">Gästebuch von <strong>{daten.besitzer}</strong></p>
              {eventDatumFormatiert && <p className="fe-event-datum">{eventDatumFormatiert}</p>}
            </div>
          </div>

          {/* Foto */}
          <div className="fe-foto-bereich">
            {foto
              ? <img src={foto} alt="Dein Foto" className="fe-foto-vorschau" style={{ borderColor: eventTyp.farbe }} />
              : <div className="fe-foto-platzhalter" style={{ borderColor: eventTyp.farbe }}>📷</div>
            }
            {kameraAktiv ? (
              <div className="fe-kamera">
                <video ref={videoRef} autoPlay playsInline muted className="fe-kamera-video" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                <div className="fe-kamera-buttons">
                  <button type="button" className="fe-btn fe-btn-klein" onClick={fotoMachen} style={{ background: eventTyp.farbe }}>📸 Foto</button>
                  <button type="button" className="fe-btn fe-btn-grau fe-btn-klein" onClick={kameraStoppen}>✕</button>
                </div>
              </div>
            ) : (
              <div className="fe-foto-optionen">
                <button type="button" className="fe-btn fe-btn-klein" onClick={kameraStarten} style={{ background: eventTyp.farbe }}>📷 Kamera</button>
                <label className="fe-btn fe-btn-klein" style={{ background: eventTyp.farbe }}>
                  🖼 Datei
                  <input type="file" accept="image/*" onChange={handleDatei} style={{ display: 'none' }} />
                </label>
                {foto && <button type="button" className="fe-btn fe-btn-grau fe-btn-klein" onClick={() => setFoto(null)}>✕</button>}
              </div>
            )}
            {kameraFehler && <p className="fe-kamera-fehler">{kameraFehler}</p>}
          </div>

          {/* Name nur auf erster Seite */}
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

          {/* Bisherige Gäste */}
          {daten.eintraege?.length > 0 && (
            <div className="fe-eintraege">
              <p className="fe-eintraege-titel">Bereits eingetragen ({daten.eintraege.length}):</p>
              <div className="fe-chips">
                {daten.eintraege.slice(0, 8).map((e, i) => (
                  <div key={i} className="fe-freund-chip">
                    {e.foto
                      ? <img src={e.foto} alt={e.freund_name} className="fe-chip-foto" />
                      : <span className="fe-chip-initial" style={{ background: eventTyp.farbe }}>{e.freund_name.charAt(0).toUpperCase()}</span>
                    }
                    <span>{e.freund_name}</span>
                  </div>
                ))}
                {daten.eintraege.length > 8 && <div className="fe-freund-chip">+{daten.eintraege.length - 8}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Rechte Seite: Fragen */}
        <div className="fe-rechts">
          {!letzteSeite ? (
            <>
              <p className="fe-seite-nr">Frage {aktiveSeite * SEITE_GROESSE + 1}–{Math.min((aktiveSeite + 1) * SEITE_GROESSE, fragen.length)} von {fragen.length}</p>
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
                <div className="fe-nav-row">
                  {aktiveSeite > 0 && (
                    <button type="button" className="fe-btn fe-btn-grau" onClick={() => setAktiveSeite(aktiveSeite - 1)}>← Zurück</button>
                  )}
                  <button type="button" className="fe-btn fe-btn-weiter" onClick={() => setAktiveSeite(aktiveSeite + 1)} style={{ background: eventTyp.farbe }}>
                    Weiter →
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form className="fe-abschluss" onSubmit={handleSenden}>
              <div className="fe-abschluss-check">
                <span style={{ fontSize: '2.5rem' }}>{eventTyp.emoji}</span>
                <p className="fe-abschluss-text">
                  Alles ausgefüllt! {!foto && <span className="fe-foto-hinweis">Tipp: Füge noch ein Foto hinzu 📷</span>}
                </p>
                {!name.trim() && <p style={{ color: '#8b2020', fontSize: '0.82rem', fontStyle: 'italic' }}>Bitte trage links deinen Namen ein.</p>}
              </div>
              {fehler && <p className="fe-fehler">{fehler}</p>}
              <div className="fe-abschluss-buttons">
                <button type="button" className="fe-btn fe-btn-grau" onClick={() => setAktiveSeite(aktiveSeite - 1)}>← Zurück</button>
                <button type="submit" className="fe-btn" disabled={!name.trim()} style={{ background: eventTyp.farbe }}>
                  📖 Ins Gästebuch eintragen
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreundEintrag;
