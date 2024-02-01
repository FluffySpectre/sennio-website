import { withTranslation } from "react-i18next";
import "./NavBar.css";

function NavBar(props) {
  const t = props.t;

  // nav links
  const navLinks = [
    { page: "projects", title: "menuLinks.projects" },
    // { page: "about-me", title: "menuLinks.aboutMe" },
    // { page: "contact", title: "menuLinks.contact" },
  ];

  const navLinkElements = navLinks.map((n, i) => (
    <span key={"NavLink" + i}>
      <span className="nav-link" onClick={() => props.navTo(n.page)}>
        <span
          style={{
            visibility: props.page === n.page ? "visible" : "hidden",
          }}
        >
          &gt;&nbsp;
        </span>
        {t(n.title)}
        <span style={{ visibility: "hidden" }}>&gt;&nbsp;</span>
      </span>
      {/* {i < navLinks.length - 1 && <span className="separator">&#x2022;</span>} */}
    </span>
  ));

  return (
    <div className="NavBar" style={props.style}>
      {navLinkElements}
    </div>
  );
}

export default withTranslation()(NavBar);
