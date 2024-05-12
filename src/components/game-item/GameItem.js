import "./GameItem.css";

function GameItem(props) {
  return (
    <div
      className="GameItem"
        // style={{
        //   backgroundColor: props.mostPlayedRecently ? "#33333330" : "transparent"
        // }}
    >
      <img className="Icon" src={props.imageURL} alt={props.gameName + " icon"} />
      <span className="GameName">{props.gameName}</span>
      {props.mostPlayedRecently && <img className="MostPlayedTag" src="assets/images/most_played_sprite.gif" alt={props.gameName + " most-played"} />}
    </div>
  );
}

export default GameItem;
