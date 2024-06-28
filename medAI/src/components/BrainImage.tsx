import {
  Grid,
  GridItem,
  Text,
  Box,
  Image,
  IconButton,
  Tooltip,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import React, { useEffect, useState } from "react";
import { FaSearchPlus, FaSearchMinus, FaUndo, FaSyncAlt } from "react-icons/fa";

interface BrainImageProps {
  prediction: string;
  image: File | null;
}

function BrainImage({ prediction, image }: BrainImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [image]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const verifyPrediction = () => {
    console.log("Verify prediction");
    toast({
      title: "Prediction verified",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleButtonClick = (tumorType: string) => {
    console.log(tumorType);
    toast({
      title: "Changed prediction",
      description: `Prediction changed to ${tumorType}`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
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
        >
          {imageUrl && (
            <TransformWrapper>
              {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                <React.Fragment>
                  <HStack
                    spacing={2}
                    position="absolute"
                    top={0}
                    right={0}
                    zIndex={10}
                    bg="white"
                    p={2}
                    borderRadius="md"
                    boxShadow="md"
                  >
                    <Tooltip label="Zoom in" aria-label="Zoom in">
                      <IconButton
                        aria-label="Zoom in"
                        icon={<FaSearchPlus />}
                        onClick={() => zoomIn()}
                        colorScheme="blue"
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Zoom out" aria-label="Zoom out">
                      <IconButton
                        aria-label="Zoom out"
                        icon={<FaSearchMinus />}
                        onClick={() => zoomOut()}
                        colorScheme="blue"
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Reset" aria-label="Reset">
                      <IconButton
                        aria-label="Reset"
                        icon={<FaUndo />}
                        onClick={() => resetTransform()}
                        colorScheme="blue"
                        size="sm"
                      />
                    </Tooltip>
                    <Tooltip label="Reupload" aria-label="Reupload">
                      <IconButton
                        aria-label="Reupload"
                        icon={<FaSyncAlt />}
                        onClick={handleRefresh}
                        colorScheme="blue"
                        size="sm"
                      />
                    </Tooltip>
                  </HStack>
                  <TransformComponent>
                    <Image
                      src={imageUrl}
                      alt="Uploaded Image"
                      maxW="100%"
                      maxH="450px"
                      cursor="grab"
                      onMouseDown={(e) =>
                        (e.currentTarget.style.cursor = "grabbing")
                      }
                      onMouseUp={(e) => (e.currentTarget.style.cursor = "grab")}
                    />
                  </TransformComponent>
                </React.Fragment>
              )}
            </TransformWrapper>
          )}
        </GridItem>
        <GridItem
          w="100%"
          h="500px"
          bg="gray.500"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Box
            p={4}
            bg={prediction === "No tumor" ? "green.500" : "red.500"}
            borderRadius="md"
            boxShadow="md"
            mb={4}
          >
            <Text fontSize="xl" color="white">
              Prediction
            </Text>
            <Text mt={2} color="white">
              <b>{prediction}</b>
            </Text>
          </Box>
          <Button
            colorScheme="teal"
            size="md"
            mb={4}
            onClick={verifyPrediction}
          >
            Verify Prediction
          </Button>
          <Button colorScheme="orange" size="md" onClick={onOpen}>
            Correct Prediction
          </Button>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Correct Prediction</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} justify="center">
              <Button onClick={() => handleButtonClick("Glioma tumor")}>
                Glioma tumor
              </Button>
              <Button onClick={() => handleButtonClick("No tumor")}>
                No tumor
              </Button>
              <Button onClick={() => handleButtonClick("Meningioma tumor")}>
                Meningioma tumor
              </Button>
              <Button onClick={() => handleButtonClick("Pituitary tumor")}>
                Pituitary tumor
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default BrainImage;
