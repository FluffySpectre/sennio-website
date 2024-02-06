import { withTranslation } from "react-i18next";
import "./Header.css";
import Avatar from "../avatar/Avatar";
import NavBar from "../nav-bar/NavBar";

function Header(props) {
  const t = props.t;
  return (
    <div className="Header" style={props.style}>
      <div className="header-slot start">
        <button
          className="DefaultButton HamburgerMenu"
          onClick={() => props.toggleMenu()}
        >
          <img src="assets/images/menu.png" alt="Menu Icon"></img>
        </button>
        <span className="TitleText TitleTextVisible">{t("title")}</span>
        <Avatar />
      </div>
      <div className="header-slot middle">
        <NavBar
          navTo={props.navTo}
          page={props.page}
          hide={!props.menuActive}
        />
      </div>
      <div className="header-slot end">
        <a
          href="https://github.com/FluffySpectre"
          target="_blank"
          rel="noreferrer"
          className="DefaultButton header-link"
        >
          <img src="assets/images/github-icon.png" alt="Github Icon"></img>
        </a>

        <a
          href="https://sennio.itch.io"
          target="_blank"
          rel="noreferrer"
          className="DefaultButton header-link"
          placeholder="itch.io"
        >
          <img src="assets/images/itch-icon.png" alt="Itch Icon"></img>
        </a>
      </div>
    </div>
  );
}

export default withTranslation()(Header);
