import React from "react";
import FreundebuchSeite from "./FreundebuchSeite.jsx";
const FRAGEN = [
  'Was war dein größter Fehlkauf?',
  'Welches ist das absurdeste Buch, das du je gelesen hast?',
  'Wenn du einen beliebigen Job auf der Welt haben könntest, welcher wäre es?',
  'Was ist dein Lieblingswitz über dein eigenes Sternzeichen?',
  'Welche Reality-Show würdest du gerne gewinnen und warum?',
];
const Freunde7 = () => <FreundebuchSeite seite={7} fragen={FRAGEN} vorSeite={6} nachSeite={8} />;
export default Freunde7;
