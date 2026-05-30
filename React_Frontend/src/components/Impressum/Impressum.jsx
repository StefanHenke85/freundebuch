import React from 'react';
import '../Impressum/Impressum.css'


const Impressum = () => {
  return (
    <div className="containerI">
      <h1 id='Impressum'>Impressum</h1>

      <div id="content">

        <p className='pI'>Angaben gemäß § 5 TMG:</p>
       
        <p className='pI'>
          Stefan Henke<br />
          Deutschland
        </p>

        <p className='pI'>
          Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:<br />
          Stefan Henke
        </p>

        <p className='pI'>
          Kontakt:<br />
          E-Mail: henke.stefan1985@gmail.com
        </p>
       
        <p className='pI3'> 
          Haftungsausschluss:<br />
          Haftung für Inhalte<br />
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte <br /> auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. <br />Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, <br /> übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach <br /> Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          Verpf- <br />lichtungen  zur Entfernung oder Sperrung der Nutzung von Informationen <br /> nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche <br />Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten <br />Rechtsverletzung  möglich. Bei Bekanntwerden von entsprechenden <br />Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
        </p>
      
      </div>
    </div>
  );
}

export default Impressum;
