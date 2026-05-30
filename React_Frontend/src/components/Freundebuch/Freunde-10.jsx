import React from "react";
import FreundebuchSeite from "./FreundebuchSeite.jsx";
const FRAGEN = [
  'Was ist dein geheimes Lieblingslied, das dir peinlich ist, laut zu hören?',
  'Wenn du ein Haus aus Süßigkeiten bauen könntest, welche Süßigkeit wäre die Hauptzutat?',
  'Was ist der lustigste Spitzname, den du je einem Lehrer gegeben hast?',
  'Welche Fernsehwerbung kannst du auswendig und warum?',
  'Was war das seltsamste Geburtstagsgeschenk, das du je erhalten hast?',
];
const Freunde10 = () => <FreundebuchSeite seite={10} fragen={FRAGEN} vorSeite={9} />;
export default Freunde10;
