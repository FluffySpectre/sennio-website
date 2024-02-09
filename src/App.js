import React from "react";
import { Outlet } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import ParticlesBackground from "./components/particles-background/ParticlesBackground";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuActive: false,
      pageTitle: "",
    };
  }

  toggleMenu = () => {
    this.setState({ menuActive: !this.state.menuActive });
  };

  navTo = (page) => {
    this.setState({ menuActive: false, pageTitle: page.title });
  };

  render() {
    return (
      <div className="App">
        <ParticlesBackground />

        <Header
          toggleMenu={this.toggleMenu}
          menuActive={this.state.menuActive}
          navTo={this.navTo}
          pageTitle={this.state.pageTitle}
        />

        <div className="PagesContainer">
          <Outlet />
        </div>

        <Footer navTo={this.navTo} />
      </div>
    );
  }
}

export default withTranslation()(App);
