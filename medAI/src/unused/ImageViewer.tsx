import React from "react";
import ReactPanZoom from "react-image-pan-zoom-rotate";

interface ImageViewerProps {
  url: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ url }) => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ReactPanZoom alt="image viewer" image={url} />
      </div>
    </>
  );
};

export default ImageViewer;
