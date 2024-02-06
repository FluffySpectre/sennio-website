import React from "react";
import { withTranslation } from "react-i18next";
import "./LastPlayedGamesPage.css";
import SteamService from "../services/SteamService";

class LastPlayedGamesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      gamesService: new SteamService(),
      lastPlayedGames: [],
    };
  }

  componentDidMount() {
    this.refreshLastPlayedGames();
  }

  async refreshLastPlayedGames() {
    const lastPlayedGames = await this.state.gamesService
      .getLastPlayedGames()
      .catch((err) => {
        console.log(
          "LastPlayedGamesPage.refreshLastPlayedGames: Fetching of last played games failed!",
          err.message
        );
      });
    if (lastPlayedGames) {
      this.setState({ lastPlayedGames });
    }
  }

  render() {
    const gameList = this.state.lastPlayedGames.map((g, i) => {
      return (
        <div key={"LPG" + i} className="GameItem">
          <img src={g.imageURL} alt={g.name + " icon"} />
          <span className="GameName">{g.name}</span>
        </div>
      );
    });
    return (
      <div className="LastPlayedGamesPage">
        <div className="GamesListContainer">{gameList}</div>
      </div>
    );
  }
}

export default withTranslation()(LastPlayedGamesPage);
