import React from "react";
import { Outlet } from "react-router-dom";
import { withTranslation } from "react-i18next";
import "./App.css";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import FakeLoadingScreen from "./components/fake-loading-screen/FakeLoadingScreen";
import ParticlesBackground from "./components/particles-background/ParticlesBackground";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuActive: false,
      pageTitle: "",
      isLoading: true,
    };
  }

  toggleMenu = () => {
    this.setState({ menuActive: !this.state.menuActive });
  };

  navTo = (page) => {
    this.setState({ menuActive: false, pageTitle: page.title });

    // scroll back up if page has changed
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <div className="App">
        {this.state.isLoading && <FakeLoadingScreen onLoadComplete={() => this.setState({ isLoading: false })} />}

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
