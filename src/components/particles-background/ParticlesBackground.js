import React from "react";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import { loadSquareShape } from "tsparticles-shape-square";

class ParticlesBackground extends React.Component {
  async particlesInit(engine) {
    await loadSquareShape(engine);
    await loadSlim(engine);
  }

  render() {
    const options = {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      particles: {
        number: {
          value: 100,
        },
        move: {
          direction: "none", // MoveDirection.none,
          enable: true,
          outModes: {
            default: "out", //OutMode.out,
          },
          random: true,
          speed: 0.1,
          straight: false,
        },
        opacity: {
          animation: {
            enable: true,
            speed: 1,
            sync: false,
          },
          value: { min: 0, max: 1 },
        },
        size: {
          value: { min: 1, max: 3 },
        },
        shape: {
          type: "square",
        },
      },
    };

    return <Particles options={options} init={this.particlesInit} />;
  }
}

export default ParticlesBackground;
