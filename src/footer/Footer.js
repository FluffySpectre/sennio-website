import { withTranslation } from "react-i18next";
import "./Footer.css";

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
    </div>
  );
}

export default withTranslation()(Footer);
