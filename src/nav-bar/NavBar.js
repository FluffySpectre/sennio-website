import { withTranslation } from "react-i18next";
import "./NavBar.css";
import NavLink from "../nav-link/NavLink";

function NavBar(props) {
  // nav links
  const navLinks = [
    { page: "projects", title: "menuLinks.projects" },
    // { page: "skills", title: "menuLinks.skills" },
    // { page: "about-me", title: "menuLinks.aboutMe" },
    // { page: "contact", title: "menuLinks.contact" },
    { page: "last-played-games", title: "menuLinks.lastPlayedGames" },
  ];

  const navLinkElements = navLinks.map((n, i) => (
    <span key={"NavLink" + i}>
      <NavLink targetPage={n.page} title={n.title} />
      {/* {navLinks.length > 1 && i < navLinks.length - 1 && (
        <span className="separator">&#x2022;</span>
      )} */}
    </span>
  ));

  return (
    <div className={"NavBar" + (props.hide ? " Hide" : "")} style={props.style}>
      {navLinkElements}
    </div>
  );
}

export default withTranslation()(NavBar);
