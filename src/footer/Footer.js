import { withTranslation } from "react-i18next";
import "./Footer.css";
import packageJSON from "../../package.json";

function Footer(props) {
  const t = props.t;
  return (
    <div className="Footer" style={props.style}>
      <span>{t("followMe")}</span>&nbsp;
      {/* <a href="https://www.instagram.com/_sennio_/" target="_blank" rel="noreferrer">Instagram</a> */}
      {/* &nbsp;•&nbsp; */}
      <a href="https://sennio.itch.io/" target="_blank" rel="noreferrer">
        itch.io
      </a>
      &nbsp; - &nbsp;
      <div>v{packageJSON.version}</div>
    </div>
  );
}

export default withTranslation()(Footer);
