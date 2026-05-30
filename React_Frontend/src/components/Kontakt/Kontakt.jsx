import React, { useState } from "react";
import emailjs from "emailjs-com";
import "./Kontakt.css";
import absendenImage from "./absendenImage.png"; // Stellen Sie sicher, dass der Pfad korrekt ist

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const templateParams = {
      from_name: name,
      from_email: email,
      message: message,
    };

    emailjs.send(
      "service_k4r4wrs",  // Ihre EmailJS-Service-ID
      "template_w792nal", // Ihre EmailJS-Template-ID
      templateParams,
      "tKK2H8TUXqqd8k17m"      // Ihre EmailJS-User-ID
    )
    .then((response) => {
      console.log("SUCCESS!", response.status, response.text);
      alert("Nachricht wurde erfolgreich gesendet!");
      setName("");
      setEmail("");
      setMessage("");
    })
    .catch((err) => {
      console.error("FAILED...", err);
      alert("Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.");
    });
  };

  return (
    <div className="containerK">
      <div id="text-section">
        <h1 id="h1K">Kontakt</h1>
        <div id="p-position">
          <p className="pK">
            Wenn Sie Fragen zu unserem Unternehmen <br /> haben oder weitere
            Informationen benötigen,
            <br /> können Sie uns gerne kontaktieren:
          </p>
          <p className="pK">
            Stefan Henke
            <br />
            Deutschland
          </p>
          <p className="pK">
            E-Mail: henke.stefan1985@gmail.com
          </p>
        </div>
      </div>
      <div id="form-section">
        <form id="contact-form" onSubmit={handleSubmit}>
          <p className="alternativ-text">Alternativ können Sie auch das Kontaktformular verwenden:</p>
          <label htmlFor="name">Name:</label>
          <br />
          <input
            className="inputK"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <br />
          <label htmlFor="email">E-Mail:</label>
          <br />
          <input
            className="inputK"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <br />
          <label htmlFor="message">Nachricht:</label>
          <br />
          <textarea
            id="textareaK"
            name="message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
          <br />
          <button type="submit" className="submit-button">
            <img src={absendenImage} alt="Absenden" className="submit-image" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
