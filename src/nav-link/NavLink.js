import { withTranslation } from "react-i18next";
import "./NavLink.css";

function NavLink(props) {
  const t = props.t;
  const isActive = props.page === props.targetPage;

  return (
    <span
      className="NoUserSelect NavLink"
      style={props.style}
      onClick={() => props.navTo(props.targetPage)}
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
    </span>
  );
}

export default withTranslation()(NavLink);
