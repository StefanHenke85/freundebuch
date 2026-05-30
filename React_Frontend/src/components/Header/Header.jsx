import React, { useState, useRef } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Header = () => {
  const [link, setLink] = useState('');
  const [kopiert, setKopiert] = useState(false);
  const [ladend, setLadend] = useState(false);
  const linkInputRef = useRef(null);
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const generateLink = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    if (ladend) return;
    setLadend(true);
    try {
      const res = await fetch('/api/link/generate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLink(data.link);
      setKopiert(false);
    } catch {
      alert('Fehler beim Generieren des Links.');
    } finally {
      setLadend(false);
    }
  };

  const handleKopieren = () => {
    if (!link) return;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(link).then(() => {
        setKopiert(true);
        setTimeout(() => setKopiert(false), 2500);
      });
    } else {
      // Fallback für ältere Browser
      if (linkInputRef.current) {
        linkInputRef.current.select();
        document.execCommand('copy');
        setKopiert(true);
        setTimeout(() => setKopiert(false), 2500);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <nav>
        <ul className="nav-links">
          <li><Link className="nav-button" to="/Home">Home</Link></li>
          <li><Link className="nav-button" to="/Profil">Profil</Link></li>
          <li><Link className="nav-button" to="/1-Freunde">Freundebuch</Link></li>
          <li>
            <a href="/" className="nav-button" onClick={generateLink}>
              {ladend ? 'Generiere…' : 'Buch teilen'}
            </a>
          </li>
          <li><Link className="nav-button" to="/MeineFreunde">Meine Freunde</Link></li>
          <li><Link className="nav-button" to="/drucken">🖨️ Drucken</Link></li>
          {user && (
            <li>
              <button className="nav-button logout-btn" onClick={handleLogout}>
                Logout ({user.username})
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="logo">
        <span id="logoH">📖 Freundebuch</span>
      </div>

      {link && (
        <div className="share-popup">
          <p className="share-popup-titel">🔗 Teile diesen Link mit deinen Freunden:</p>
          <div className="share-popup-row">
            <input
              ref={linkInputRef}
              className="share-link-input"
              type="text"
              value={link}
              readOnly
              onClick={e => e.target.select()}
            />
            <button className="share-kopieren-btn" onClick={handleKopieren}>
              {kopiert ? '✓ Kopiert!' : 'Kopieren'}
            </button>
            <button className="share-schliessen-btn" onClick={() => setLink('')}>✕</button>
          </div>
          <p className="share-popup-hinweis">Klick auf das Feld um den Link auszuwählen</p>
        </div>
      )}
    </header>
  );
};

export default Header;
