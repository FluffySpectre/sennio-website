import React from "react";
import i18n from "../i18n";
import "./ProjectTile.css";

class ProjectTile extends React.Component {
  constructor(props) {
    super(props);

    this.videoEl = React.createRef();
  }

  componentDidMount() {
    this.loadVideoClip();
  }

  tileMouseEnter() {
    this.playVideoClip();
    this.props.onHoverStart(this.props.project.name);
  }

  tileMouseExit() {
    this.pauseAndResetVideoClip();
    this.props.onHoverEnd();
  }

  tileClick() {
    this.pauseAndResetVideoClip();
    this.props.onClick(this.props.project);
  }

  loadVideoClip() {
    if (this.props.project.hasPreview) {
      this.videoEl.current.load();
    }
  }

  playVideoClip() {
    if (this.props.project.hasPreview) {
      this.videoEl.current.play();
    }
  }

  pauseAndResetVideoClip() {
    if (this.props.project.hasPreview) {
      this.videoEl.current.pause();
      this.videoEl.current.currentTime = 0;
    }
  }

  render() {
    const langKey = i18n.resolvedLanguage || "en";

    const hovered = this.props.hoveredProject === this.props.project.name;
    const selected = this.props.selectedProject === this.props.project.name;
    const highlighted = hovered || selected;

    const shouldDisplayStaticImage =
      !highlighted ||
      (!this.props.project.hasPreview && highlighted) ||
      (this.props.project.hasPreview && selected);
    const shouldDisplayVideo =
      this.props.project.hasPreview && !selected && hovered;

    const lowerCaseProjectName = this.props.project.name.toLowerCase();
    const projectImgFilename = lowerCaseProjectName.split(" ").join("");
    const thumbUrl =
      "assets/projects/" +
      projectImgFilename +
      "/" +
      projectImgFilename +
      "_thumb.webp";
    const clipUrl =
      "assets/projects/" + projectImgFilename + "/" + projectImgFilename;

    return (
      <div
        className={
          "ProjectTile PixelBorder" +
          (highlighted ? " PixelBorderHighlighted" : "")
        }
        onMouseEnter={() => this.tileMouseEnter()}
        onMouseLeave={() => this.tileMouseExit()}
        onClick={() => this.tileClick()}
      >
        <img
          style={{ display: shouldDisplayStaticImage ? "flex" : "none" }}
          src={thumbUrl}
          alt={this.props.project.name + " Thumbnail"}
        ></img>
        {this.props.project.hasPreview && (
          <video
            ref={this.videoEl}
            style={{ display: shouldDisplayVideo ? "flex" : "none" }}
            preload="metadata"
            loop
            muted
            playsInline
            poster={thumbUrl}
          >
            {/* <source src={clipUrl + '_512x320.webm'} type="video/webm" /> */}
            <source src={clipUrl + "_512x320.mp4"} type="video/mp4" />
          </video>
        )}

        <div className={"ProjectLabel" + (highlighted ? " Show" : "")}>
          <span>{this.props.project.name}</span>
          <span className="ProjectDescription">
            {this.props.project.shortDescription[langKey] ||
              this.props.project.shortDescription.en}
          </span>
        </div>
      </div>
    );
  }
}

export default ProjectTile;
