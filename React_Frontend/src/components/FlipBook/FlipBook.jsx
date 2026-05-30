import React, { useEffect, useState, useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './FlipBook.css';
import '../Profil/Profil-Design.css';
import { Link } from "react-router-dom";






// Seite-Komponente mit Vorwärts-Referenzierung
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      {props.children}
    </div>
  );
});

function DemoBook() {



 

  const book = useRef();
  const [name, setName] = useState("");
  const [fragen, setFragen] = useState([]);
  const [antworten, setAntworten] = useState([]);
  const profilId = 1; // Beispielprofil-ID, dies sollte dynamisch sein

  useEffect(() => {
    // API-Aufruf, um die Fragen zu holen
    fetch('http://localhost:3001/fragen')
      .then(response => response.json())
      .then(data => setFragen(data))
      .catch(error => console.error('Error fetching questions:', error));
  }, []);

  useEffect(() => {
    // API-Aufruf, um die Antworten zu holen
    fetch(`http://localhost:3001/antworten/${profilId}`)
      .then(response => response.json())
      .then(data => setAntworten(data))
      .catch(error => console.error('Error fetching answers:', error));
  }, []);


        

  return (
    <>
      <HTMLFlipBook
        width={200}
        height={170}
        size="stretch"
        drawShadow={false}
        flippingTime={1000}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={1}
        showCover={false}
        mobileScrollSupport={true}
        swipeDistance={30}
        clickEventForward={true}
        useMouseEvents={true}
        renderOnlyPageLengthChange={false}
        ref={book}
        className="flipbook"
      >


        
        <Page>
          <h1>Wer bin ich?</h1>
          <p>Ich heiße <input type="text" placeholder="Dein Name" value={name} onChange={(e) => setName(e.target.value)} /></p>
        </Page>

        {fragen.map((frage, index) => (
          <Page key={index}>
            <h1>Frage {index + 1}</h1>
            <p>{frage.frage}</p>
            <p>Antwort: <input type="text" value={antworten[index]?.antwort || ''} onChange={(e) => {
              const newAntworten = [...antworten];
              newAntworten[index] = { ...newAntworten[index], antwort: e.target.value };
              setAntworten(newAntworten);
            }} /></p>
          </Page>
        ))}
      </HTMLFlipBook>

      <button id="ZurückFlipBook">
        <Link to="/10-Freunde">10. Seite</Link>
      </button>
    </>
  );
}

export default DemoBook;
