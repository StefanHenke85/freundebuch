import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './MeineFreundeSeite.css';

const MeineFreundeSeite = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [freunde, setFreunde] = useState([]);
  const [ausgewaehlt, setAusgewaehlt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/api/freunde', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setFreunde(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, navigate]);

  if (loading) return <div className="mf-wrapper"><p style={{ color: '#c4a882', fontStyle: 'italic' }}>Laden…</p></div>;

  return (
    <div className="mf-wrapper">
      <div className="mf-buch">
        {/* Linke Seite: Freundesliste */}
        <div className="mf-links">
          <h2 className="mf-titel">Meine Freunde</h2>
          <p className="mf-anzahl">{freunde.length} Einträge</p>

          {freunde.length === 0 ? (
            <div className="mf-leer">
              <p>Noch keine Einträge.</p>
              <p>Teile deinen Link damit Freunde dein Buch ausfüllen können!</p>
            </div>
          ) : (
            <ul className="mf-liste">
              {freunde.map((f, i) => (
                <li key={i}
                  className={`mf-eintrag ${ausgewaehlt === i ? 'mf-eintrag-aktiv' : ''}`}
                  onClick={() => setAusgewaehlt(ausgewaehlt === i ? null : i)}
                >
                  {f.foto
            ? <img src={f.foto} alt={f.freund_name} className="mf-avatar-foto" />
            : <div className="mf-avatar">{f.freund_name.charAt(0).toUpperCase()}</div>
          }
                  <div className="mf-info">
                    <strong>{f.freund_name}</strong>
                    <span>{new Date(f.created_at).toLocaleDateString('de-DE')}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Rechte Seite: Antworten des ausgewählten Freundes */}
        <div className="mf-rechts">
          {ausgewaehlt === null ? (
            <div className="mf-hinweis">
              <p>← Klick auf einen Freund um seine Antworten zu lesen</p>
            </div>
          ) : (
            <div className="mf-antworten">
              <div className="mf-antworten-header">
                {freunde[ausgewaehlt].foto
                  ? <img src={freunde[ausgewaehlt].foto} alt="" className="mf-antworten-foto" />
                  : <div className="mf-avatar mf-avatar-gross">{freunde[ausgewaehlt].freund_name.charAt(0).toUpperCase()}</div>
                }
                <h3 className="mf-antworten-name" style={{ margin: 0 }}>{freunde[ausgewaehlt].freund_name}</h3>
              </div>
              <div className="mf-antworten-liste">
                {(freunde[ausgewaehlt].antworten || []).map((a, i) => (
                  <div key={i} className="mf-antwort-item">
                    <p className="mf-frage">{a.frage}</p>
                    <p className="mf-antwort">{a.antwort || <em>Keine Antwort</em>}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeineFreundeSeite;
