import { Link, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./NavLink.css";
import navLinks from "../services/NavLinks";

function NavLink(props) {
  const t = props.t;
  const location = useLocation();
  const isActive = location.pathname === "/" + props.targetPage;

  // TODO: clean me up
  let title = props.title;
  if (!title) {
    title = navLinks[location.pathname];
  }

  return (
    <Link
      to={props.targetPage}
      className="NoUserSelect NavLink"
      style={props.style}
      onClick={() => props.navTo({ page: props.targetPage, title: t(title) })}
    >
      <span
        style={{
          visibility: isActive ? "visible" : "hidden",
        }}
      >
        &lt;&nbsp;
      </span>
      {t(title)}
      <span
        style={{
          visibility: isActive ? "visible" : "hidden",
        }}
      >
        &nbsp;/&gt;
      </span>
    </Link>
  );
}

export default withTranslation()(NavLink);
