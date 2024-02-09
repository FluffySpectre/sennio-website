import React from "react";
import { withTranslation } from "react-i18next";
import "./ImpressumPage.css";

class ImpressumPage extends React.Component {
  render() {
    return (
      <div className="ImpressumPage">
        <h1>Impressum</h1>

        <h2>Angaben gem&auml;&szlig; &sect; 5 TMG</h2>
        <p>
          Bj&ouml;rn Bosse
          <br />
          Wehlauer Str. 33
          <br />
          28844 Weyhe
        </p>

        <h2>Kontakt</h2>
        <p>
          Telefon: 0172 9087076
          <br />
          E-Mail: mail@sennio.de
        </p>

        <p>
          Quelle:&nbsp;
          <a href="https://www.e-recht24.de/impressum-generator.html">
            https://www.e-recht24.de/impressum-generator.html
          </a>
        </p>
      </div>
    );
  }
}

export default withTranslation()(ImpressumPage);
