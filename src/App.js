import Projects from "./projects";
import React from "react";
import { withTranslation } from "react-i18next";
import "./App.css";
// import AnimateHeight from "react-animate-height";
import ProjectTile from "./project-tile/ProjectTile";
import ProjectPage from "./project-page/ProjectPage";
import Footer from "./footer/Footer";
import Avatar from "./avatar/Avatar";
import LinkTile from "./link-tile/LinkTile";
import ParticlesBackground from "./particles-background/ParticlesBackground";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      animateTitle: true,
      animateSubtitle: true,
      animateProjects: true,
      hoveredTileProjectName: null,
      selectedProject: null,
      showProjectPage: false,
      scrollY: "0px",
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollTracker);

    setTimeout(() => {
      this.setState({ animateTitle: true });
    }, 100);

    setTimeout(() => {
      this.setState({ animateSubtitle: true });
    }, 1500);

    setTimeout(() => {
      this.setState({ animateProjects: true });
    }, 5000);
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
        {t("githubLink")} &gt;
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
      <div className="App">
        <ParticlesBackground />

        <Footer
          style={{
            transition: "opacity",
            transitionDuration: "1s",
            opacity: this.state.animateSubtitle ? 1 : 0,
          }}
        />

        <div className="AppContainer">
          <p
            className="Title"
            style={{ opacity: this.state.animateTitle ? 1 : 0 }}
          >
            <span>{t("title")}</span>
            <span>
              <Avatar />
            </span>
          </p>
          <p
            className="Subtitle"
            style={{ opacity: this.state.animateSubtitle ? 1 : 0 }}
          >
            {t("subTitle")}
          </p>

          {/* <AnimateHeight
            id="ProjectsPanel"
            duration={1000}
            height={this.state.animateProjects ? "auto" : 0}
            animateOpacity={true}
          > */}
          <div className="ProjectsContainer">{complete}</div>
          {/* </AnimateHeight> */}
        </div>

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

export default withTranslation()(App);
