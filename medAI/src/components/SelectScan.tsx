import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, GridItem, Button } from "@chakra-ui/react";
import chestXrayImage from "../assets/IM-0006-0001.jpeg";
import brainImage from "../assets/imageBrain.jpg";
import Header from "./Header";

interface SelectScanProps {
  signOut: () => void;
}

const SelectScan: React.FC<SelectScanProps> = ({
  signOut,
}: SelectScanProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Box w="100vw" h="100vh" bg="gray.100">
      <Header headerText="Home" signOut={signOut} />
      <Grid
        templateColumns="repeat(2, 1fr)"
        gap={6}
        p={6}
        alignItems="center"
        justifyContent="center"
        marginTop="100px"
      >
        <GridItem
          w="80%"
          maxW="400px" // Max width to further control the width
          h="300px"
          marginLeft="25%"
          bgImage={`url(${chestXrayImage})`}
          bgSize="cover"
          bgPosition="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          overflow="hidden"
          transition="background-color 0.3s ease"
          _before={{
            content: `""`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "rgba(0, 0, 0, 0.5)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
          _hover={{
            _before: {
              opacity: 1,
            },
          }}
          onClick={() => handleNavigation("/chest-xray-layout")}
        >
          <Button
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            _focus={{ boxShadow: "none", outline: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation("/chest-xray-layout");
            }}
          >
            Chest X-Ray Analysis
          </Button>
        </GridItem>
        <GridItem
          w="80%"
          maxW="400px" // Max width to further control the width
          h="300px"
          bgImage={`url(${brainImage})`}
          bgSize="cover"
          bgPosition="center"
          marginLeft="10%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          position="relative"
          overflow="hidden"
          transition="background-color 0.3s ease"
          _before={{
            content: `""`,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "rgba(0, 0, 0, 0.5)",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
          _hover={{
            _before: {
              opacity: 1,
            },
          }}
          onClick={() => handleNavigation("/brain-image-layout")}
        >
          <Button
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            _focus={{ boxShadow: "none", outline: "none" }}
            onClick={(e) => {
              e.stopPropagation();
              handleNavigation("/brain-image-layout");
            }}
          >
            Brain Image Analysis
          </Button>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default SelectScan;
