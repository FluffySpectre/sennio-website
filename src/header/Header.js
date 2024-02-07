import { withTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "./Header.css";
import Avatar from "../avatar/Avatar";
import NavBar from "../nav-bar/NavBar";
// import NavLink from "../nav-link/NavLink";
import navLinks from "../services/NavLinks";

function Header(props) {
  const t = props.t;
  const location = useLocation();

  return (
    <div className="Header" style={props.style}>
      <div className="header-slot start">
        <div
          className="DefaultButton HamburgerMenu"
          onClick={() => props.toggleMenu()}
        >
          <img src="assets/images/menu.png" alt="Menu Icon"></img>
        </div>
        <span className="TitleText TitleTextVisible">{t("title")}</span>
        <Avatar />
      </div>
      <div className="header-slot middle">
        <NavBar hide={!props.menuActive} navTo={props.navTo} />
        <span className="PageTitleMobile">
          {/* <NavLink
            targetPage={location.pathname.substring(1)}
            title={props.pageTitle}
            navTo={props.navTo}
          ></NavLink> */}
          {t(navLinks[location.pathname])}
        </span>
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
