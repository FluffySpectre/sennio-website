import React from "react";
import { withTranslation } from "react-i18next";
import i18n from "../i18n";
import "./ProjectPage.css";
import ImageGallery from "../image-gallery/ImageGallery";
import TechTag from "../tech-tag/TechTag";

class ProjectPage extends React.Component {
  playClick() {
    window.open(this.props.project.play, "_blank");
  }

  render() {
    const t = this.props.t;
    const langKey = i18n.resolvedLanguage || "en";

    const lowerCaseProjectName = this.props.project.name.toLowerCase();
    const projectImgFilename = lowerCaseProjectName.split(" ").join("");
    const imageBaseUrl =
      "assets/projects/" + projectImgFilename + "/" + projectImgFilename;
    const images = [imageBaseUrl + "_thumb.webp"];
    // add the clip, if one exists...
    if (this.props.project.hasPreview) {
      // images.push(imageBaseUrl + '_1280x800.webm');
      images.push(imageBaseUrl + "_1280x800.mp4");
    }
    // add other images
    for (let i = 0; i < this.props.project.images; i++) {
      images.push(imageBaseUrl + "_" + (i + 1) + ".webp");
    }

    let downloadButtons;
    if (
      this.props.project.downloads &&
      this.props.project.downloads.length > 0
    ) {
      downloadButtons = this.props.project.downloads.map((d) => (
        <a
          key={"DownloadButton" + d.platform}
          className="DefaultButton DownloadButton notranslate"
          href={d.link}
        >
          <span>{d.platform}</span>
        </a>
      ));
    }

    return (
      <div className="ProjectPage">
        <div
          className={
            "PageContainer" +
            (this.props.show ? " FadeAndFlyIn" : " FadeAndFlyOut")
          }
          onAnimationEnd={() => this.props.animationEnd()}
        >
          <div className="PageScrollContainer">
            <div className="ProjectImages">
              <ImageGallery images={images} />

              {this.props.project.play && (
                <div
                  className="DefaultButton PlayButton"
                  onClick={() => this.playClick()}
                >
                  <span className="blink">{t("projectPage.playButton")}</span>
                </div>
              )}
            </div>

            <div className="ProjectPageTitle">{this.props.project.name}</div>

            <div className="TechTagsContainer">
              {this.props.project.techTags &&
                this.props.project.techTags.map((t) => (
                  <TechTag key={"TechTag" + t} techName={t} />
                ))}
            </div>

            <div className="ProjectPageDescription">
              {this.props.project.description[langKey] ||
                this.props.project.description.en}
            </div>

            {downloadButtons && (
              <div>
                <div className="DownloadsTitle">
                  {t("projectPage.downloads")}
                </div>
                <div className="Downloads">{downloadButtons}</div>
              </div>
            )}
          </div>
          <div
            className="DefaultButton ProjectPageCloseX"
            onClick={() => this.props.onClose()}
          >
            {/* <img src="assets/images/closex.png" alt="Close X"></img> */}
            <span>X</span>
          </div>
        </div>
        <div
          className={"Backdrop" + (this.props.show ? " FadeIn" : " FadeOut")}
          onClick={() => this.props.onClose()}
        ></div>
      </div>
    );
  }
}

export default withTranslation()(ProjectPage);
