import React from "react";

import styles from "react-responsive-carousel/lib/styles/carousel.min.css"; // eslint-disable-line no-unused-vars
import { Carousel } from "react-responsive-carousel";
import "./ImageGallery.css";
import FixedAspect from "../fixed-aspect/FixedAspect";

class ImageGallery extends React.Component {
  render() {
    const videoTypes = ["mp4"]; // in order of preference
    const videoAspect = 1.6; // = 16:10
    const images = this.props.images.map((url, i) => {
      const fileUrlSplits = url.split(".");
      const fileUrlWithoutExtension = fileUrlSplits[0];
      const fileExtension = fileUrlSplits[1];

      // if the file is a video, use a video tag
      if (videoTypes.includes(fileExtension)) {
        return (
          <FixedAspect
            aspectRatio={videoAspect}
            key={"GalleryImageAspectContainer" + i}
          >
            <video
              className="GalleryItem"
              key={"GalleryImage" + i}
              preload="metadata"
              autoPlay
              loop
              muted
              playsInline
            >
              {videoTypes.map((t) => (
                <source
                  key={"GalleryImageSource" + t}
                  src={fileUrlWithoutExtension + "." + t}
                  type={"video/" + t}
                />
              ))}
            </video>
          </FixedAspect>
        );
        // otherwise, use an image tag
      } else {
        return (
          <img
            className="GalleryItem"
            key={"GalleryImage" + i}
            src={url}
            alt={"Gallery " + i}
          />
        );
      }
    });

    return (
      <div className="ImageGallery">
        <Carousel
          showArrows={true}
          showThumbs={false}
          swipeable={false}
          renderIndicator={(clickHandler, selected, index, label) => {
            // only show the indicator, if there is more than 1 image
            if (images.length >= 2) {
              return selected ? (
                <div className="IndicContainer">
                  <div
                    className="ImageCarouselIndic IndicSelected"
                    onClick={clickHandler}
                  ></div>
                </div>
              ) : (
                <div className="IndicContainer">
                  <div
                    className="ImageCarouselIndic"
                    onClick={clickHandler}
                  ></div>
                </div>
              );
            }
            return undefined;
          }}
          renderArrowNext={(clickHandler, hasNext, label) => {
            // only show the arrow, if there is more than 1 image
            if (hasNext) {
              return (
                <div
                  className="PixelBorder CustomArrowContainer Next"
                  onClick={clickHandler}
                >
                  <div className="CustomImageCarouselArrow Next"></div>
                </div>
              );
            }
            return undefined;
          }}
          renderArrowPrev={(clickHandler, hasPrev, label) => {
            if (hasPrev) {
              return (
                <div
                  className="PixelBorder CustomArrowContainer Previous"
                  onClick={clickHandler}
                >
                  <div className="CustomImageCarouselArrow Previous"></div>
                </div>
              );
            }
            return undefined;
          }}
        >
          {images}
        </Carousel>
      </div>
    );
  }
}

export default ImageGallery;
