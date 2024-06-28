import React, { useEffect, useState, useRef } from "react";
import {
  Grid,
  GridItem,
  Image as ChakraImage,
  Box,
  Text,
  IconButton,
  VStack,
  Tooltip,
  HStack,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import {
  FaSearchPlus,
  FaSearchMinus,
  FaSyncAlt,
  FaRedo,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import Chat from "./Chat";

interface BoundingBox {
  bounds: number[];
  description: string;
}

interface AnalysisResult {
  image: string;
  description: string;
}

interface AnalysisResults {
  height: number;
  width: number;
  bounding_boxes: BoundingBox[];
  summary: string;
  pneumonia: string;
}

interface AnalysisError {
  error: string;
}

interface ChestXrayProps {
  results: AnalysisResults | AnalysisError | null;
  selectedFile: File | null;
}

const resizeImage = (
  file: File,
  width: number,
  height: number
): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas);
    };

    img.onerror = (error) => {
      reject(error);
    };
  });
};

const drawBoundingBox = (
  canvas: HTMLCanvasElement,
  boundingBox: number[]
): HTMLCanvasElement => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const bounds = boundingBox;
  if (bounds && bounds.length === 4) {
    const [x1, y1, x2, y2] = bounds;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
  } else {
    console.error("Invalid bounding box bounds:", bounds);
  }

  return canvas;
};

function ChestXray({ results, selectedFile }: ChestXrayProps) {
  const [images, setImages] = useState<AnalysisResult[]>([]);
  const [selectedImage, setSelectedImage] = useState<AnalysisResult | null>(
    null
  );
  const [zoom, setZoom] = useState<number>(1);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const prompt =
    results && "summary" in results
      ? `${results.summary} - this is the summary obtained from the AI model. give a brief description of the 
    summary. Only answer questions from the user that is related to 
    medical image analysis and this summary and dont answer anything else.
    inform the user to ask only questions related to medicine or the summary.`
      : "";
  const pneumonia =
    results && "pneumonia" in results
      ? results.pneumonia === "Pneumonia"
        ? "Pneumonia detected"
        : "Pneumonia not detected"
      : "";
  const toast = useToast();

  useEffect(() => {
    if (!selectedFile || !results || "error" in results) return;

    const processImages = async () => {
      try {
        const resizedCanvas = await resizeImage(selectedFile, 512, 512);
        const newImages = results.bounding_boxes
          .map((box) => {
            const b = box as unknown as [number[], string];
            const canvasCopy = document.createElement("canvas");
            const ctx = canvasCopy.getContext("2d");
            if (!ctx) return null;

            canvasCopy.width = resizedCanvas.width;
            canvasCopy.height = resizedCanvas.height;
            ctx.drawImage(resizedCanvas, 0, 0);
            const image = drawBoundingBox(canvasCopy, b[0]).toDataURL();
            return { image, description: b[1] };
          })
          .filter((result): result is AnalysisResult => result !== null);
        setImages(newImages);
        if (newImages.length > 0) setSelectedImage(newImages[0]);
      } catch (error) {
        console.error("Error processing images", error);
      }
    };

    processImages();
  }, [selectedFile, results]);

  useEffect(() => {
    // Center the image when selectedImage or zoom changes
    setPosition({ x: 0, y: 0 });
  }, [selectedImage, zoom]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 }); // Reset position to center the image
  };
  const handleRefresh = () => window.location.reload();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const verifyPrediction = () => {
    toast({
      title: "Prediction verified",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const wrongPrediction = () => {
    toast({
      title: "Prediction corrected",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <div>
      <Grid templateColumns="repeat(2, 1fr)" gap={6} p={6}>
        <GridItem
          w="100%"
          h="500px"
          bg="gray.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          overflow="hidden"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <Box position="absolute" top={2} right={2} zIndex={10}>
            <VStack spacing={2}>
              <Tooltip label="Zoom In" aria-label="Zoom In Tooltip">
                <IconButton
                  icon={<FaSearchPlus />}
                  aria-label="Zoom In"
                  onClick={handleZoomIn}
                  _focus={{ boxShadow: "none", outline: "none" }}
                />
              </Tooltip>
              <Tooltip label="Zoom Out" aria-label="Zoom Out Tooltip">
                <IconButton
                  icon={<FaSearchMinus />}
                  aria-label="Zoom Out"
                  onClick={handleZoomOut}
                  _focus={{ boxShadow: "none", outline: "none" }}
                />
              </Tooltip>
              <Tooltip label="Reset Zoom" aria-label="Reset Zoom Tooltip">
                <IconButton
                  icon={<FaSyncAlt />}
                  aria-label="Reset Zoom"
                  onClick={handleResetZoom}
                  _focus={{ boxShadow: "none", outline: "none" }}
                />
              </Tooltip>
              <Tooltip label="Upload again" aria-label="Upload again Tooltip">
                <IconButton
                  icon={<FaRedo />}
                  aria-label="Upload again"
                  onClick={handleRefresh}
                  _focus={{ boxShadow: "none", outline: "none" }}
                />
              </Tooltip>
            </VStack>
          </Box>
          {selectedImage && (
            <ChakraImage
              ref={imageRef}
              src={selectedImage.image}
              alt={`Annotated X-ray`}
              maxH="500px"
              transform={`scale(${zoom}) translate(${position.x / zoom}px, ${
                position.y / zoom
              }px)`}
              transition="transform 0.2s"
              style={{
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
            />
          )}
        </GridItem>
        <GridItem w="100%" h="500px" bg="gray.500" overflowY="scroll">
          <Tabs
            isFitted
            variant="unstyled"
            index={selectedTab}
            onChange={setSelectedTab}
          >
            <TabList>
              <Tab
                _selected={{ color: "white", bg: "blue.500" }}
                borderRadius={0}
                _hover={{ bg: "blue.300" }}
                _focus={{ boxShadow: "none", outline: "none" }}
              >
                Analysis
              </Tab>
              <Tab
                _selected={{ color: "white", bg: "blue.500" }}
                borderRadius={0}
                _hover={{ bg: "blue.300" }}
                _focus={{ boxShadow: "none", outline: "none" }}
              >
                Chat
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {pneumonia !== "" && (
                  <Box
                    p={4}
                    m={3.5}
                    bg={
                      pneumonia === "Pneumonia detected"
                        ? "yellow.100"
                        : "green.200"
                    }
                    borderRadius="md"
                    boxShadow="md"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text fontWeight="bold">{pneumonia}</Text>
                    <HStack spacing={2}>
                      <Tooltip
                        label="Verify Prediction"
                        aria-label="Verify Prediction Tooltip"
                      >
                        <IconButton
                          icon={<FaCheck />}
                          aria-label="Verify Prediction"
                          onClick={verifyPrediction}
                          _focus={{ boxShadow: "none", outline: "none" }}
                        />
                      </Tooltip>
                      <Tooltip
                        label="Wrong Prediction"
                        aria-label="Wrong Prediction Tooltip"
                      >
                        <IconButton
                          icon={<FaTimes />}
                          aria-label="Wrong Prediction"
                          onClick={wrongPrediction}
                          _focus={{ boxShadow: "none", outline: "none" }}
                        />
                      </Tooltip>
                    </HStack>
                  </Box>
                )}
                {images.map((image, index) => (
                  <Box
                    key={index}
                    p={4}
                    m={3.5}
                    bg={
                      selectedImage?.image === image.image
                        ? "blue.100"
                        : "white"
                    }
                    borderRadius="md"
                    boxShadow="md"
                    cursor="pointer"
                    onClick={() => {
                      setSelectedImage(image);
                      setPosition({ x: 0, y: 0 });
                      setZoom(1);
                    }}
                    _hover={{ background: "blue.100" }}
                  >
                    <Text>{image.description}</Text>
                  </Box>
                ))}
              </TabPanel>
              <TabPanel>
                <Chat userId={"user-id"} initialPrompt={prompt} />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </GridItem>
      </Grid>
    </div>
  );
}

export default ChestXray;
