import { Link, useLocation } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./NavLink.css";

function NavLink(props) {
  const t = props.t;
  const location = useLocation();
  const isActive = location.pathname === "/" + props.targetPage;

  return (
    <Link
      to={props.targetPage}
      className="NoUserSelect NavLink"
      style={props.style}
      onClick={() => props.linkClick()}
    >
      <span
        style={{
          visibility: isActive ? "visible" : "hidden",
        }}
      >
        &lt;&nbsp;
      </span>
      {t(props.title)}
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
