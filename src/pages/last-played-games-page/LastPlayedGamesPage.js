import React from "react";
import { withTranslation } from "react-i18next";
import "./LastPlayedGamesPage.css";
import { getLastPlayedGames } from "../../services/api";
import GameItem from "../../components/game-item/GameItem";

class LastPlayedGamesPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastPlayedGames: [],
    };
  }

  componentDidMount() {
    this.refreshLastPlayedGames();
  }

  async refreshLastPlayedGames() {
    const lastPlayedGames = await getLastPlayedGames().catch((err) => {
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
        <GameItem
          key={"LPG" + i}
          gameName={g.name}
          imageURL={g.imageURL}
          playtimePercentage={g.playtimePercentage}
        />
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
