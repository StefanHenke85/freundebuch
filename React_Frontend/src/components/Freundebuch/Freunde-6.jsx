import React from "react";
import FreundebuchSeite from "./FreundebuchSeite.jsx";
const FRAGEN = [
  'Welcher TikTok-Trend ist dein Favorit?',
  'Wenn du für einen Tag das Gegenteil deines Geschlechts wärst, was würdest du tun?',
  'Was ist das Lustigste, das dir in der Küche passiert ist?',
  'Welcher Gegenstand aus deiner Kindheit fehlt dir am meisten?',
  'Was ist dein peinlichstes Foto?',
];
const Freunde6 = () => <FreundebuchSeite seite={6} fragen={FRAGEN} vorSeite={5} nachSeite={7} />;
export default Freunde6;
