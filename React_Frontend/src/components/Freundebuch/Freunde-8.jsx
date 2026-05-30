import React from "react";
import FreundebuchSeite from "./FreundebuchSeite.jsx";
const FRAGEN = [
  'Wenn du eine Erfindung der Vergangenheit rückgängig machen könntest, welche wäre es?',
  'Was ist das merkwürdigste Ritual, das du vor Prüfungen hast?',
  'Wenn du in einem Märchen leben könntest, welches wäre es und warum?',
  'Was ist das Lustigste, was du je bei einer Familienfeier erlebt hast?',
  'Wenn du ein Lied schreiben müsstest, wovon würde es handeln?',
];
const Freunde8 = () => <FreundebuchSeite seite={8} fragen={FRAGEN} vorSeite={7} nachSeite={9} />;
export default Freunde8;
