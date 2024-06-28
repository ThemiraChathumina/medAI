import React, { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import ImageUpload from "./ImageUpload";
import BrainImage from "./BrainImage";
import Header from "./Header";

interface BrainImageLayoutProps {
  signOut: () => void;
}

const BrainImageLayout: React.FC<BrainImageLayoutProps> = ({
  signOut,
}: BrainImageLayoutProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const toast = useToast();

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      const response = await fetch(
        "http://localhost:8000/predict_brain_tumor/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok && data.error === undefined) {
        setPrediction(data.prediction);
        setError(undefined);
      } else {
        setPrediction(null);
        setError(data.error);
        toast({
          title: "Error",
          description: data.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (err) {
      setPrediction(null);
      const errorMessage = "An error occurred while uploading the file";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsUploading(false);
  };

  return (
    <Box w="100vw" h="100vh" bg="gray.100">
      <Header headerText="Brain Tumor Detection" signOut={signOut} />
      {prediction === null ? (
        <ImageUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          handleUpload={handleUpload}
          isUploading={isUploading}
        />
      ) : (
        <BrainImage image={selectedFile} prediction={prediction} />
      )}
    </Box>
  );
};

export default BrainImageLayout;
