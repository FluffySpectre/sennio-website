import "./GameItem.css";

function GameItem(props) {
  return (
    <div
      className="GameItem"
      //   style={{
      //     opacity:
      //       0.5 +
      //       (parseFloat(props.playtimePercentage) *
      //         parseFloat(props.playtimePercentage)) /
      //         100,
      //   }}
    >
      <img className="Icon" src={props.imageURL} alt={props.gameName + " icon"} />
      <span className="GameName">{props.gameName}</span>
      {props.mostPlayedRecently && <img className="MostPlayedTag" src="assets/images/most_played_sprite.gif" alt={props.gameName + " most-played"} />}
    </div>
  );
}

export default GameItem;
