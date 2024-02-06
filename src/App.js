import React from "react";
import { withTranslation } from "react-i18next";
import "./App.css";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import ParticlesBackground from "./particles-background/ParticlesBackground";
import ProjectsPage from "./projects-page/ProjectsPage";
import LastPlayedGamesPage from "./last-played-games-page/LastPlayedGamesPage";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: "projects",
    };
  }

  navTo = (page) => {
    this.setState({ page });
  };

  render() {
    return (
      <div className="App">
        <ParticlesBackground />

        <Header navTo={this.navTo} page={this.state.page} />

        <div className="PagesContainer">
          {this.state.page === "projects" && <ProjectsPage />}
          {this.state.page === "last-played-games" && <LastPlayedGamesPage />}
        </div>

        <Footer />
      </div>
    );
  }
}

export default withTranslation()(App);
