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
import Confirm from "./components/RecConLog/confirm.jsx";

import Profil1 from "./components/Profil/1-Profil-Rohling.jsx";

import Book from "./components/MeineFreundeSeite/MeineFreundeSeite.jsx";

import Chat from "./components/Chat/chat.jsx"; // Importiert die Chat-Komponente

function App() {
  const location = useLocation();
  const profilId = 1; // Beispiel-Profil-ID, dies sollte dynamisch sein

  const hideHeaderRoutes = ['/', '/Home', '/login', '/register', '/confirm'];

  return (
    <>
      {!hideHeaderRoutes.includes(location.pathname) && <Header />}
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/Kontakt" element={<Contact />} />
        <Route path="/Datenschutz" element={<Datenschutz />} />
        <Route path="/Impressum" element={<Impressum />} />
        <Route path="/Datenschutzerklärung" element={<Datenschutzerklärung />} />

        <Route path="/1-Freunde" element={<Freunde1 profilId={profilId} />} />
        <Route path="/2-Freunde" element={<Freunde2 profilId={profilId} />} />
        <Route path="/3-Freunde" element={<Freunde3 profilId={profilId} />} />
        <Route path="/4-Freunde" element={<Freunde4 profilId={profilId} />} />
        <Route path="/5-Freunde" element={<Freunde5 profilId={profilId} />} />
        <Route path="/6-Freunde" element={<Freunde6 profilId={profilId} />} />
        <Route path="/7-Freunde" element={<Freunde7 profilId={profilId} />} />
        <Route path="/8-Freunde" element={<Freunde8 profilId={profilId} />} />
        <Route path="/9-Freunde" element={<Freunde9 profilId={profilId} />} />
        <Route path="/10-Freunde" element={<Freunde10 profilId={profilId} />} />
        
        <Route path="/FlipBook" element={<DemoBook profilId={profilId} />} />

        <Route path="/MeineFreunde" element={<Book />} />

        <Route path="/Profil" element={<Profil1 />} />

        <Route path="/confirm" element={<Confirm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/chat" element={<Chat />} /> {/* Fügen Sie diese Zeile hinzu */}
      </Routes>
      <Footer />
    </>
  );
}

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
