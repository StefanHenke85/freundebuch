import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getEventTyp } from '../../data/eventFragen.js';
import './MeineEvents.css';

const MeineEvents = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [ausgewaehlt, setAusgewaehlt] = useState(null);
  const [gaeste, setGaeste] = useState([]);
  const [ausgewaehltGast, setAusgewaehltGast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ladeGaeste, setLadeGaeste] = useState(false);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/api/meine-events', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setEvents(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, navigate]);

  const handleEventWahl = async (event) => {
    if (ausgewaehlt?.id === event.id) { setAusgewaehlt(null); setGaeste([]); setAusgewaehltGast(null); return; }
    setAusgewaehlt(event);
    setAusgewaehltGast(null);
    setLadeGaeste(true);
    try {
      const res = await fetch(`/api/event-gaeste?linkId=${event.id}`, { headers: { Authorization: `Bearer ${token}` } });
      const d = await res.json();
      setGaeste(d.gaeste || []);
    } finally {
      setLadeGaeste(false);
    }
  };

  const handleGastLoeschen = async (gastId) => {
    if (!window.confirm('Diesen Gast wirklich löschen?')) return;
    const res = await fetch(`/api/freunde-loeschen?id=${gastId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setGaeste(prev => prev.filter(g => g.id !== gastId));
      if (ausgewaehltGast?.id === gastId) setAusgewaehltGast(null);
    }
  };

  const base = window.location.origin;

  if (loading) return <div className="me-wrapper"><p className="me-laden">Laden…</p></div>;

  return (
    <div className="me-wrapper">
      <div className="me-layout">

        {/* Spalte 1: Event-Liste */}
        <div className="me-events-liste">
          <h2 className="me-titel">Meine Events</h2>
          <p className="me-anzahl">{events.length} Event{events.length !== 1 ? 's' : ''}</p>

          {events.length === 0 ? (
            <div className="me-leer">
              <p>Noch keine Events erstellt.</p>
              <p>Klick auf <strong>+ Event erstellen</strong> im Header!</p>
            </div>
          ) : (
            <ul className="me-liste">
              {events.map(ev => {
                const typ = getEventTyp(ev.event_typ);
                const aktiv = ausgewaehlt?.id === ev.id;
                return (
                  <li key={ev.id}
                    className={`me-event-item ${aktiv ? 'me-event-aktiv' : ''}`}
                    style={aktiv ? { borderLeftColor: typ.farbe } : {}}
                    onClick={() => handleEventWahl(ev)}
                  >
                    <span className="me-event-emoji">{typ.emoji}</span>
                    <div className="me-event-info">
                      <strong>{ev.event_name || typ.label}</strong>
                      <span>{new Date(ev.created_at).toLocaleDateString('de-DE')}</span>
                    </div>
                    <span className="me-event-count" style={{ background: typ.farbe }}>
                      {ev.eintraege_anzahl}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Spalte 2: Gäste-Liste */}
        <div className="me-gaeste-liste">
          {!ausgewaehlt ? (
            <div className="me-hinweis"><p>← Wähle ein Event aus</p></div>
          ) : (
            <>
              <div className="me-gaeste-header">
                <div>
                  <h3 className="me-gaeste-titel">
                    {getEventTyp(ausgewaehlt.event_typ).emoji} {ausgewaehlt.event_name || getEventTyp(ausgewaehlt.event_typ).label}
                  </h3>
                  {ausgewaehlt.event_datum && (
                    <p className="me-gaeste-datum">
                      {new Date(ausgewaehlt.event_datum).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  )}
                </div>
                <button
                  className="me-link-kopieren"
                  onClick={() => navigator.clipboard?.writeText(`${base}/freund/${ausgewaehlt.id}`)}
                  title="Link kopieren"
                >
                  🔗 Link kopieren
                </button>
              </div>

              {ladeGaeste ? (
                <p className="me-laden">Lade Gäste…</p>
              ) : gaeste.length === 0 ? (
                <div className="me-leer">
                  <p>Noch keine Gäste eingetragen.</p>
                  <p style={{ fontSize: '0.78rem', wordBreak: 'break-all' }}>
                    Link: <a href={`${base}/freund/${ausgewaehlt.id}`} target="_blank" rel="noreferrer">{base}/freund/{ausgewaehlt.id}</a>
                  </p>
                </div>
              ) : (
                <ul className="me-gast-liste">
                  {gaeste.map((g, i) => (
                    <li key={g.id}
                      className={`me-gast-item ${ausgewaehltGast?.id === g.id ? 'me-gast-aktiv' : ''}`}
                      onClick={() => setAusgewaehltGast(ausgewaehltGast?.id === g.id ? null : g)}
                    >
                      {g.foto
                        ? <img src={g.foto} alt={g.freund_name} className="me-gast-foto" />
                        : <div className="me-gast-avatar" style={{ background: getEventTyp(ausgewaehlt.event_typ).farbe }}>
                            {g.freund_name.charAt(0).toUpperCase()}
                          </div>
                      }
                      <div className="me-gast-info">
                        <strong>{g.freund_name}</strong>
                        <span>{new Date(g.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                      <button className="me-loeschen-btn" onClick={e => { e.stopPropagation(); handleGastLoeschen(g.id); }} title="Löschen">✕</button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {/* Spalte 3: Antworten */}
        <div className="me-antworten">
          {!ausgewaehltGast ? (
            <div className="me-hinweis"><p>← Wähle einen Gast aus</p></div>
          ) : (
            <>
              <div className="me-antworten-header">
                {ausgewaehltGast.foto
                  ? <img src={ausgewaehltGast.foto} alt="" className="me-antworten-foto" />
                  : <div className="me-gast-avatar me-gast-avatar-gross" style={{ background: getEventTyp(ausgewaehlt?.event_typ).farbe }}>
                      {ausgewaehltGast.freund_name.charAt(0).toUpperCase()}
                    </div>
                }
                <div>
                  <h4 className="me-antworten-name">{ausgewaehltGast.freund_name}</h4>
                  {ausgewaehltGast.freund_email && <p className="me-antworten-email">{ausgewaehltGast.freund_email}</p>}
                </div>
              </div>
              <div className="me-antworten-liste">
                {(ausgewaehltGast.antworten || []).filter(a => a.antwort).map((a, i) => (
                  <div key={i} className="me-antwort-item">
                    <p className="me-frage">{a.frage}</p>
                    <p className="me-antwort">{a.antwort}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default MeineEvents;
