// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import "./styles.css";

import Home from "./components/Home/Home.jsx";
import Contact from './components/Kontakt/Kontakt.jsx';
import Datenschutz from './components/Datenschutz/Datenschutz.jsx';
import Impressum from './components/Impressum/Impressum.jsx';
import Footer from './components/Footer/Footer.jsx';
import Header from "./components/Header/Header.jsx";
import Datenschutzerklärung from "./components/Datenschutz/Datenschutzerklärung.jsx";

import Freunde1 from "./components/Freundebuch/1-Freunde.jsx";
import Freunde2 from "./components/Freundebuch/2-Freunde.jsx";
import Freunde3 from "./components/Freundebuch/3-Freunde.jsx";
import Freunde4 from "./components/Freundebuch/4-Freunde.jsx";
import Freunde5 from "./components/Freundebuch/5-Freunde.jsx";
import Freunde6 from "./components/Freundebuch/Freunde-6.jsx";
import Freunde7 from "./components/Freundebuch/Freunde-7.jsx";
import Freunde8 from "./components/Freundebuch/Freunde-8.jsx";
import Freunde9 from "./components/Freundebuch/Freunde-9.jsx";
import Freunde10 from "./components/Freundebuch/Freunde-10.jsx";
import DemoBook from "./components/FlipBook/FlipBook.jsx";

import Register from "./components/RecConLog/register.jsx";
import Login from "./components/RecConLog/login.jsx";

import Profil1 from "./components/Profil/1-Profil-Rohling.jsx";

import Book from "./components/MeineFreundeSeite/MeineFreundeSeite.jsx";

import Chat from "./components/Chat/chat.jsx";
import FreundEintrag from "./components/FreundEintrag/FreundEintrag.jsx";
import DruckAnsicht from "./components/DruckAnsicht/DruckAnsicht.jsx";
import MeineEvents from "./components/MeineEvents/MeineEvents.jsx";
import PasswortVergessen from "./components/RecConLog/PasswortVergessen.jsx";

function App() {
  const location = useLocation();
  const hideHeaderRoutes = ['/', '/Home', '/login', '/register', '/passwort-vergessen'];
  const hideHeaderPrefixes = ['/freund/', '/drucken'];

  const versteckt = hideHeaderRoutes.includes(location.pathname) ||
    hideHeaderPrefixes.some(p => location.pathname.startsWith(p));
  const zeigeFooter = !versteckt;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!versteckt && <Header />}
      <div style={{ flex: 1 }}>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/Kontakt" element={<Contact />} />
        <Route path="/Datenschutz" element={<Datenschutz />} />
        <Route path="/Impressum" element={<Impressum />} />
        <Route path="/Datenschutzerklärung" element={<Datenschutzerklärung />} />

        <Route path="/1-Freunde" element={<Freunde1 />} />
        <Route path="/2-Freunde" element={<Freunde2 />} />
        <Route path="/3-Freunde" element={<Freunde3 />} />
        <Route path="/4-Freunde" element={<Freunde4 />} />
        <Route path="/5-Freunde" element={<Freunde5 />} />
        <Route path="/6-Freunde" element={<Freunde6 />} />
        <Route path="/7-Freunde" element={<Freunde7 />} />
        <Route path="/8-Freunde" element={<Freunde8 />} />
        <Route path="/9-Freunde" element={<Freunde9 />} />
        <Route path="/10-Freunde" element={<Freunde10 />} />
        
        <Route path="/FlipBook" element={<DemoBook />} />

        <Route path="/MeineFreunde" element={<Book />} />
        <Route path="/MeineEvents" element={<MeineEvents />} />

        <Route path="/Profil" element={<Profil1 />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/passwort-vergessen" element={<PasswortVergessen />} />

        <Route path="/chat" element={<Chat />} />
        <Route path="/freund/:linkId" element={<FreundEintrag />} />
        <Route path="/drucken" element={<DruckAnsicht />} />
      </Routes>
      </div>
      {zeigeFooter && <Footer />}
    </div>
  );
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
