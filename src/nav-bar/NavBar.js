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
    <NavLink
      targetPage={n.page}
      title={n.title}
      linkClick={props.linkClick}
      key={"NavLink" + i}
    />
  ));

  return (
    <div className={"NavBar" + (props.hide ? " Hide" : "")} style={props.style}>
      {navLinkElements}
    </div>
  );
}

export default withTranslation()(NavBar);
