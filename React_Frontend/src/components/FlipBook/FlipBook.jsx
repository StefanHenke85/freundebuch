import React, { useEffect, useState, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './FlipBook.css';

const Page = React.forwardRef(({ children, style }, ref) => (
  <div className="fb-page" ref={ref} style={style}>
    {children}
  </div>
));

const FlipBook = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [antworten, setAntworten] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setAktiveSeite] = useState(0);
  const bookRef = useRef();

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetch('/api/antworten', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => {
        // Nur Antworten die tatsächlich ausgefüllt wurden
        const gefuellt = Array.isArray(d) ? d.filter(a => a.antwort && a.antwort.trim()) : [];
        setAntworten(gefuellt);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token, navigate]);

  const goPrev = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);
  const goNext = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);

  // Je 2 Antworten pro Doppelseite
  const PAARE_PRO_SEITE = 4;
  const seiten = [];
  for (let i = 0; i < antworten.length; i += PAARE_PRO_SEITE) {
    seiten.push(antworten.slice(i, i + PAARE_PRO_SEITE));
  }

  if (loading) return (
    <div className="fb-wrapper">
      <div className="fb-laden">Lade dein Freundebuch…</div>
    </div>
  );

  return (
    <div className="fb-wrapper">
      <div className="fb-container">
        <HTMLFlipBook
          width={380}
          height={520}
          size="fixed"
          minWidth={280}
          maxWidth={500}
          minHeight={380}
          maxHeight={680}
          drawShadow={true}
          flippingTime={600}
          usePortrait={false}
          showCover={true}
          mobileScrollSupport={false}
          swipeDistance={50}
          clickEventForward={true}
          useMouseEvents={true}
          ref={bookRef}
          onFlip={e => setAktiveSeite(e.data)}
          className="fb-book"
        >
          {/* Cover */}
          <Page style={{ background: 'linear-gradient(135deg, #5c3a1e, #8b5e3c)' }}>
            <div className="fb-cover">
              <div className="fb-cover-dekor" />
              <p className="fb-cover-label">Mein</p>
              <h1 className="fb-cover-titel">Freundebuch</h1>
              <div className="fb-cover-linie" />
              <p className="fb-cover-name">{user?.vorname} {user?.nachname}</p>
              <p className="fb-cover-jahr">{new Date().getFullYear()}</p>
              <div className="fb-cover-dekor fb-cover-dekor-unten" />
            </div>
          </Page>

          {/* Intro-Seite */}
          <Page>
            <div className="fb-intro">
              <p className="fb-intro-zitat">
                „Ein Freundebuch ist ein Spiegel der Zeit —<br />
                jede Seite eine Erinnerung."
              </p>
              <div className="fb-intro-linie" />
              <p className="fb-intro-text">
                Dieses Buch gehört<br />
                <strong>{user?.vorname} {user?.nachname}</strong>
              </p>
              {antworten.length === 0 && (
                <p className="fb-leer-hinweis">
                  Du hast noch keine Fragen beantwortet.<br />
                  Geh zum <a href="/1-Freunde">Freundebuch</a> und füll es aus!
                </p>
              )}
            </div>
          </Page>

          {/* Antwort-Seiten */}
          {seiten.map((gruppe, si) => (
            <Page key={si}>
              <div className="fb-inhalt-seite">
                <span className="fb-seite-nr">{si + 1}</span>
                {gruppe.map((a, ai) => (
                  <div key={ai} className="fb-eintrag">
                    <p className="fb-eintrag-frage">{a.frage}</p>
                    <p className="fb-eintrag-antwort">{a.antwort}</p>
                  </div>
                ))}
              </div>
            </Page>
          ))}

          {/* Letzte Seite */}
          <Page>
            <div className="fb-abschluss">
              <p className="fb-abschluss-text">Ende</p>
              <div className="fb-abschluss-linie" />
              <p className="fb-abschluss-sub">{antworten.length} Antworten gespeichert</p>
              <a href="/1-Freunde" className="fb-abschluss-link">Antworten bearbeiten →</a>
            </div>
          </Page>

          {/* Rückcover */}
          <Page style={{ background: 'linear-gradient(135deg, #8b5e3c, #5c3a1e)' }}>
            <div className="fb-cover fb-rueckcover">
              <div className="fb-cover-dekor" />
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontStyle: 'italic' }}>freundebuch.app</p>
            </div>
          </Page>
        </HTMLFlipBook>

        {/* Navigation */}
        <div className="fb-nav">
          <button className="fb-nav-btn" onClick={goPrev}>← Zurück</button>
          <span className="fb-nav-info">
            {antworten.length > 0 ? `${antworten.length} Antworten` : 'Noch leer'}
          </span>
          <button className="fb-nav-btn" onClick={goNext}>Weiter →</button>
        </div>
      </div>
    </div>
  );
};

export default FlipBook;
