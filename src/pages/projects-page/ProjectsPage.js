import Projects from "../../projects";
import React from "react";
import { withTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import "./ProjectsPage.css";
import ProjectTile from "../../components/project-tile/ProjectTile";
import ProjectPage from "../../components/project-page/ProjectPage";
import LinkTile from "../../components/link-tile/LinkTile";

// This wrapper component uses hooks and passes the params to the class component
function ProjectsPageWrapper(props) {
  const params = useParams();
  const navigate = useNavigate();
  return <ProjectsPageComponent {...props} params={params} navigate={navigate} />;
}

class ProjectsPageComponent extends React.Component {
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

    // Check if a project name is in the URL params
    const { projectName } = this.props.params;
    if (projectName) {
      // Find the project with the matching name
      const project = Projects.find(p => this.getProjectSlug(p.name) === projectName);
      if (project) {
        this.setState({ selectedProject: project, showProjectPage: true });
        this.disableBodyScrolling();
      } else {
        // If the project name doesn't exist, navigate back to projects
        this.props.navigate("/projects");
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollTracker);
  }

  // Helper function to convert project name to URL-friendly format
  getProjectSlug = (projectName) => {
    return projectName.toLowerCase().replace(/\s+/g, '-');
  };

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
    
    // Update the URL when a project is selected
    const projectSlug = this.getProjectSlug(project.name);
    this.props.navigate(`/projects/${projectSlug}`);
  }

  projectPageClose() {
    this.setState({ showProjectPage: false });
    this.enableBodyScrolling();

    // Update the URL to remove the project name
    this.props.navigate("/projects");
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

export default withTranslation()(ProjectsPageWrapper);
