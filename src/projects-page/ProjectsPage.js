import Projects from "../projects";
import React from "react";
import { withTranslation } from "react-i18next";
import "./ProjectsPage.css";
import ProjectTile from "../project-tile/ProjectTile";
import ProjectPage from "../project-page/ProjectPage";
import LinkTile from "../link-tile/LinkTile";

class ProjectsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hoveredTileProjectName: null,
      selectedProject: null,
      showProjectPage: false,
      scrollY: "0px",
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollTracker);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollTracker);
  }

  scrollTracker = () => {
    // save the current vertical scroll position in the state
    // to restore it later when the project page gets closed
    this.setState({ scrollY: window.scrollY + "px" });
  };

  tileHoverStart(projectName) {
    this.setState({ hoveredTileProjectName: projectName });
  }

  tileHoverEnd() {
    this.setState({ hoveredTileProjectName: null });
  }

  tileClicked(project) {
    this.setState({ selectedProject: project, showProjectPage: true });
    this.disableBodyScrolling();
  }

  projectPageClose() {
    this.setState({ showProjectPage: false });
    this.enableBodyScrolling();
  }

  projectPageAnimationEnd() {
    // reset the selected project if the closing animation of the project page is finished
    if (!this.state.showProjectPage) {
      this.setState({ selectedProject: null });
    }
  }

  disableBodyScrolling() {
    const scrollY = this.state.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = "-" + scrollY;
  }

  enableBodyScrolling() {
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }

  render() {
    const t = this.props.t;

    // setup projects
    let p = Projects.map((project) => (
      <ProjectTile
        key={project.name}
        project={project}
        selectedProject={this.state.selectedProject?.name}
        hoveredProject={this.state.hoveredTileProjectName}
        onHoverStart={(projectName) => this.tileHoverStart(projectName)}
        onHoverEnd={() => this.tileHoverEnd()}
        onClick={(project) => this.tileClicked(project)}
      />
    ));
    p.push(
      <LinkTile
        name="github-link"
        key="link-1"
        href="https://github.com/FluffySpectre"
        hovered={this.state.hoveredTileProjectName}
        onHoverStart={() => this.tileHoverStart("github-link")}
        onHoverEnd={() => this.tileHoverEnd()}
      >
        {t("githubLink")}
        <br />
        <img
          id="GitHubIcon"
          src="assets/images/github-icon.png"
          alt="Github Icon"
        ></img>
      </LinkTile>
    );

    // add line breaks
    let complete = [];
    let breakCount = p.length / 3;
    for (let i = 0; i < breakCount; i++) {
      let pieces = p.slice(i * 3, i * 3 + 3);
      complete.push(pieces);
      complete.push(<div key={"break" + i} className="Break"></div>);
    }

    return (
      <div className="ProjectsPage">
        <div className="ProjectsContainer">{complete}</div>

        {this.state.selectedProject && (
          <ProjectPage
            project={this.state.selectedProject}
            show={this.state.showProjectPage}
            animationEnd={() => this.projectPageAnimationEnd()}
            onClose={() => this.projectPageClose()}
          />
        )}
      </div>
    );
  }
}

export default withTranslation()(ProjectsPage);
