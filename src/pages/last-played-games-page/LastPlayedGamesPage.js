import React from "react";
import { withTranslation } from "react-i18next";
import "./LastPlayedGamesPage.css";
import { getLastPlayedGames } from "../../services/api";

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
        <div
          key={"LPG" + i}
          className="GameItem"
          style={{
            opacity:
              0.65 +
              (parseFloat(g.playtimePercentage) *
                parseFloat(g.playtimePercentage)) /
                100,
          }}
        >
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
