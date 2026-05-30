import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div id="browndiv">
      <div className="home-overlay">
        <img id="Brownbook" src="/img/BraunesBuch.png" alt="Book" />
        <img id="federhome" src="/img/feder.png" alt="feder" />

        <div className="home-content">
          <h1 id="h1Home">Freundebuch</h1>
          <p className="home-subtitle">Halte deine Erinnerungen fest</p>
          <div className="home-buttons">
            <Link className="home-btn" to="/login">Anmelden</Link>
            <Link className="home-btn home-btn-outline" to="/register">Registrieren</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
