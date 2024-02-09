import React from "react";

class FixedAspect extends React.Component {
  constructor(props) {
    super(props);

    this.elementRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener("resize", (e) => {
      this.resizeElement();
    });
    this.resizeElement();
  }

  resizeElement = () => {
    if (
      this.elementRef &&
      this.elementRef.current &&
      this.elementRef.current.style
    ) {
      // console.log('FixedAspect: resize');
      this.elementRef.current.style.height =
        Math.floor(
          this.elementRef.current.offsetWidth / this.props.aspectRatio
        ) + "px";
    }
  };

  render() {
    return (
      <div ref={this.elementRef} style={{ width: "100%" }}>
        {this.props.children}
      </div>
    );
  }
}

export default FixedAspect;
