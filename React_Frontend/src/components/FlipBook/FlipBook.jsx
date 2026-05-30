import React, { useEffect, useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import './FlipBook.css';

const Page = React.forwardRef((props, ref) => (
  <div className="demoPage" ref={ref}>
    {props.children}
  </div>
));

function DemoBook() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const book = useRef();
  const [fragen, setFragen] = useState([]);
  const [antworten, setAntworten] = useState([]);

  useEffect(() => {
    if (!token) { navigate('/login'); return; }

    const cached = sessionStorage.getItem('fb_fragen');
    const fragenData = cached ? JSON.parse(cached) : null;

    const loadFragen = fragenData
      ? Promise.resolve(fragenData)
      : fetch('/api/fragen').then(r => r.json()).then(d => {
          sessionStorage.setItem('fb_fragen', JSON.stringify(d));
          return d;
        });

    loadFragen.then(f => {
      setFragen(f);
      return fetch('/api/antworten', { headers: { Authorization: `Bearer ${token}` } });
    })
      .then(r => r.json())
      .then(a => setAntworten(a))
      .catch(console.error);
  }, [token, navigate]);

  return (
    <div className="flipbook-wrapper">
      <HTMLFlipBook
        width={380}
        height={500}
        size="fixed"
        drawShadow={true}
        flippingTime={700}
        usePortrait={false}
        showCover={true}
        mobileScrollSupport={true}
        swipeDistance={30}
        ref={book}
        className="flipbook"
      >
        {/* Cover */}
        <Page>
          <div className="page-cover">
            <h1>Freundebuch</h1>
            <p>{user?.vorname} {user?.nachname}</p>
          </div>
        </Page>

        {/* Eine Seite pro Frage + Antwort */}
        {fragen.map((frage, index) => {
          const antwort = antworten.find(a => a.frage === frage.frage);
          return (
            <Page key={index}>
              <div className="page-content">
                <span className="page-number">{index + 1}</span>
                <p className="page-question">{frage.frage}</p>
                <p className="page-answer">{antwort?.antwort || <em>Noch keine Antwort</em>}</p>
              </div>
            </Page>
          );
        })}

        {/* Letzte Seite */}
        <Page>
          <div className="page-cover page-back">
            <p>Ende</p>
          </div>
        </Page>
      </HTMLFlipBook>

      <div className="flipbook-nav">
        <button onClick={() => book.current?.pageFlip().flipPrev()}>← Zurück</button>
        <button onClick={() => book.current?.pageFlip().flipNext()}>Weiter →</button>
      </div>
    </div>
  );
}

export default DemoBook;
