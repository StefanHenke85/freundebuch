import React, { useState } from 'react';
import './Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Header = () => {
  const [link, setLink] = useState('');
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const generateLink = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    try {
      const res = await fetch('/api/link/generate', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setLink(data.link);
    } catch {
      console.error('Fehler beim Generieren des Links.');
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
          <li><a href="/" className="nav-button" onClick={generateLink}>Mein Freundebuch teilen</a></li>
          <li><Link className="nav-button" to="/MeineFreunde">Meine Freunde</Link></li>
          {user && (
            <li>
              <button className="nav-button" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                Logout ({user.username})
              </button>
            </li>
          )}
        </ul>
      </nav>
      {link && (
        <div className="generated-link">
          <span>Dein Link: </span>
          <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
          <button onClick={() => { navigator.clipboard.writeText(link); }} style={{ marginLeft: '0.5rem' }}>
            Kopieren
          </button>
        </div>
      )}
      <div className="logo">
        <img id="logoH" src="/img/logo.png" alt="logo" />
      </div>
      <div className="search-bar">
        <input type="text" placeholder="🔍" name="search" />
      </div>
    </header>
  );
};

export default Header;
