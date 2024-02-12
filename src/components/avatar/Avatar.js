import React from "react";
import "./Avatar.css";
import {
  Avatar_Normal,
  Avatar_Blink,
  Avatar_Grin,
  Avatar_Shocked,
} from "./images";

class Avatar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      avatarState: "IDLE",
      eyeBlink: false,
      minTimeBetweenEyeBlinks: 2000,
      maxTimeBetweenEyeBlinks: 6000,
      blinkTime: 200,
    };
  }

  componentDidMount() {
    // setup eye blinking
    setTimeout(() => {
      this.blink();
    }, this.getRandomTimeBetweenBlinks());
  }

  blink = () => {
    this.setState({ eyeBlink: true });
    setTimeout(() => {
      this.setState({ eyeBlink: false });

      // schedule next blink
      setTimeout(() => {
        this.blink();
      }, this.getRandomTimeBetweenBlinks());
    }, this.state.blinkTime);
  };

  getRandomTimeBetweenBlinks() {
    return (
      Math.floor(
        Math.random() *
          (this.state.maxTimeBetweenEyeBlinks -
            this.state.minTimeBetweenEyeBlinks +
            1)
      ) + this.state.minTimeBetweenEyeBlinks
    );
  }

  getImageForCurrentState() {
    if (this.state.avatarState === "SHOCKED") {
      return Avatar_Shocked;
    } else if (this.state.avatarState === "GRIN") {
      return Avatar_Grin;
    }
    return this.state.eyeBlink ? Avatar_Blink : Avatar_Normal;
  }

  render() {
    return (
      <img
        className="Avatar"
        src={this.getImageForCurrentState()}
        alt="Avatar"
        onMouseEnter={() => this.setState({ avatarState: "GRIN" })}
        onMouseLeave={() => this.setState({ avatarState: "IDLE" })}
        onMouseDown={() => this.setState({ avatarState: "SHOCKED" })}
        onMouseUp={() => this.setState({ avatarState: "GRIN" })}
      ></img>
    );
  }
}

export default Avatar;
