import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './DruckAnsicht.css';

const DruckAnsicht = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [freunde, setFreunde] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/api/freunde', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setFreunde(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token, navigate]);

  if (loading) return <div className="druck-laden">Lade…</div>;

  return (
    <div className="druck-wrapper">
      <div className="druck-aktionen no-print">
        <button className="druck-btn" onClick={() => window.print()}>🖨️ Drucken / PDF speichern</button>
        <button className="druck-btn druck-btn-grau" onClick={() => navigate('/MeineFreunde')}>← Zurück</button>
      </div>

      <div className="druck-buch">
        {/* Titelseite */}
        <div className="druck-seite druck-titelseite">
          <h1 className="druck-haupttitel">Freundebuch</h1>
          <p className="druck-name">{user?.vorname} {user?.nachname}</p>
          <p className="druck-datum">{new Date().getFullYear()}</p>
        </div>

        {/* Eine Seite pro Freund */}
        {freunde.map((f, i) => (
          <div key={i} className="druck-seite">
            <div className="druck-seite-header">
              <div className="druck-avatar">{f.freund_name.charAt(0).toUpperCase()}</div>
              <div>
                <h2 className="druck-freund-name">{f.freund_name}</h2>
                <p className="druck-datum-klein">{new Date(f.created_at).toLocaleDateString('de-DE')}</p>
              </div>
            </div>
            <div className="druck-antworten">
              {(f.antworten || []).filter(a => a.antwort).map((a, j) => (
                <div key={j} className="druck-antwort-item">
                  <p className="druck-frage">{a.frage}</p>
                  <p className="druck-antwort">{a.antwort}</p>
                </div>
              ))}
            </div>
            <div className="druck-seite-nr">{i + 1}</div>
          </div>
        ))}

        {freunde.length === 0 && (
          <div className="druck-seite druck-leer">
            <p>Noch keine Freunde-Einträge vorhanden.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DruckAnsicht;
