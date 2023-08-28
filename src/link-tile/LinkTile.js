import React from "react";
import "./LinkTile.css";

class LinkTile extends React.Component {
  componentDidMount() {}

  tileMouseEnter() {
    this.props.onHoverStart(this.props.href);
  }

  tileMouseExit() {
    this.props.onHoverEnd();
  }

  tileClick() {
    window.open(this.props.href, "_blank", "");
  }

  render() {
    const highlighted = this.props.hovered === this.props.name;

    return (
      <div
        className={
          "LinkTile PixelBorder" +
          (highlighted ? " PixelBorderHighlighted" : "")
        }
        onMouseEnter={() => this.tileMouseEnter()}
        onMouseLeave={() => this.tileMouseExit()}
        onClick={() => this.tileClick()}
      >
        <img src="assets/images/empty_tile.png" alt={this.props.name}></img>
        <div className={"LinkContent" + (highlighted ? " Highlighted" : "")}>
          <span>{this.props.children}</span>
        </div>
      </div>
    );
  }
}

export default LinkTile;
