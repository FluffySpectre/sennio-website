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
      <img src={props.imageURL} alt={props.gameName + " icon"} />
      <span className="GameName">{props.gameName}</span>
    </div>
  );
}

export default GameItem;
