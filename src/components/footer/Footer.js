import { withTranslation } from "react-i18next";
import "./Footer.css";
import packageJSON from "../../../package.json";
import NavLink from "../nav-link/NavLink";

function Footer(props) {
  const t = props.t;
  return (
    <div className="Footer" style={props.style}>
      {/* <span>{t("followMe")}</span>&nbsp; */}
      {/* <a href="https://www.instagram.com/_sennio_/" target="_blank" rel="noreferrer">Instagram</a> */}
      {/* &nbsp;•&nbsp; */}
      {/* <a
        className="NoUserSelect"
        href="https://sennio.itch.io/"
        target="_blank"
        rel="noreferrer"
      >
        itch.io
      </a>
      &nbsp; - &nbsp; */}
      <div>v{packageJSON.version}</div>
      &nbsp; - &nbsp;
      <NavLink
        targetPage="impressum"
        title={t("impressumLink")}
        className="NoUserSelect"
        style={{ marginLeft: "0" }}
        navTo={props.navTo}
      ></NavLink>
    </div>
  );
}

export default withTranslation()(Footer);
