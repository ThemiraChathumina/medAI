import React, { useState, useRef, useEffect } from "react";

const BoundingBoxComponent: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageResolution, setImageResolution] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [boxCoords, setBoxCoords] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  }>({ x1: 0, y1: 0, x2: 0, y2: 0 });
  const [scale, setScale] = useState<number>(1);
  const [dragging, setDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          // Resize the image to 512x512
          const offscreenCanvas = document.createElement("canvas");
          offscreenCanvas.width = 512;
          offscreenCanvas.height = 512;
          const offscreenContext = offscreenCanvas.getContext("2d");
          if (offscreenContext) {
            offscreenContext.drawImage(img, 0, 0, 512, 512);
            setImageResolution({ width: 512, height: 512 });
            setImageSrc(offscreenCanvas.toDataURL());
          }
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBoxCoords((prevCoords) => ({
      ...prevCoords,
      [name]: Number(value),
    }));
  };

  const handleZoomIn = () => setScale((prevScale) => prevScale * 1.2);
  const handleZoomOut = () => setScale((prevScale) => prevScale / 1.2);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    startPos.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      setPosition({
        x: event.clientX - startPos.current.x,
        y: event.clientY - startPos.current.y,
      });
    }
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        const img = new Image();
        img.onload = () => {
          canvas.width = containerRef.current?.clientWidth || 500;
          canvas.height = containerRef.current?.clientHeight || 500;
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.save();
          context.scale(scale, scale);
          context.translate(position.x / scale, position.y / scale);
          context.drawImage(img, 0, 0, img.width, img.height);
          context.strokeStyle = "red";
          context.lineWidth = 2;
          context.strokeRect(
            boxCoords.x1,
            boxCoords.y1,
            boxCoords.x2 - boxCoords.x1,
            boxCoords.y2 - boxCoords.y1
          );
          context.restore();
        };
        img.src = imageSrc;
      }
    }
  }, [imageSrc, boxCoords, scale, position]);

  return (
    <div>
      <h1>Bounding Box Component</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {imageResolution && (
        <div>
          <p>
            Resolution: {imageResolution.width} x {imageResolution.height}
          </p>
        </div>
      )}
      <div>
        <label>
          x1:
          <input
            type="number"
            name="x1"
            value={boxCoords.x1}
            onChange={handleInputChange}
          />
        </label>
        <label>
          y1:
          <input
            type="number"
            name="y1"
            value={boxCoords.y1}
            onChange={handleInputChange}
          />
        </label>
        <label>
          x2:
          <input
            type="number"
            name="x2"
            value={boxCoords.x2}
            onChange={handleInputChange}
          />
        </label>
        <label>
          y2:
          <input
            type="number"
            name="y2"
            value={boxCoords.y2}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <button onClick={handleZoomIn}>Zoom In</button>
      <button onClick={handleZoomOut}>Zoom Out</button>
      <div
        ref={containerRef}
        style={{
          width: "500px",
          height: "500px",
          overflow: "hidden",
          position: "relative",
          border: "1px solid black",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <canvas
          ref={canvasRef}
          style={{ cursor: dragging ? "grabbing" : "grab" }}
        />
      </div>
    </div>
  );
};

export default BoundingBoxComponent;
