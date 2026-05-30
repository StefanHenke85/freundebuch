import React from "react";
import FreundebuchSeite from "./FreundebuchSeite.jsx";
const FRAGEN = [
  'Welche Superhelden-Kraft wäre im Alltag total nutzlos?',
  'Wenn du deinen eigenen Feiertag erfinden könntest, wie würde er aussehen?',
  'Was war der seltsamste Traum, den du je hattest?',
  'Welches Lebensmittel würdest du für immer aus deiner Küche verbannen?',
  'Welcher Disney-Bösewicht wärst du am liebsten?',
];
const Freunde9 = () => <FreundebuchSeite seite={9} fragen={FRAGEN} vorSeite={8} nachSeite={10} />;
export default Freunde9;
