import { withTranslation } from "react-i18next";
import "./Header.css";
import Avatar from "../avatar/Avatar";

function Header(props) {
  const t = props.t;
  return (
    <div className="Header" style={props.style}>
      <div className="header-slot start">
        <span>{t("title")}</span>
        <Avatar />
      </div>
      <div className="header-slot middle">
        <a href="#" className="menu-link">
          Projekte
        </a>
        {/* <span className="separator">&#x2022;</span> */}
        {/* <a href="/" className="menu-link">
          Über mich
  </a>*/}
        {/* <span className="separator">&#x2022;</span>
        <a href="/" className="menu-link">
          Kontakt
        </a> */}
      </div>
      <div className="header-slot end">
        <a
          href="https://sennio.itch.io"
          target="_blank"
          rel="noreferrer"
          className="header-link"
          placeholder="itch.io"
        >
          <img src="assets/images/itch-icon.png" alt="Itch Icon"></img>
        </a>

        <a
          href="https://github.com/FluffySpectre"
          target="_blank"
          rel="noreferrer"
          className="header-link"
        >
          <img src="assets/images/github-icon.png" alt="Github Icon"></img>
        </a>
      </div>
    </div>
  );
}

export default withTranslation()(Header);
