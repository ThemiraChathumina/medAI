import { useState } from "react";
import { Box, useToast } from "@chakra-ui/react";
import ImageUpload from "./ImageUpload";
import ChestXray from "./ChestXray";
import Header from "./Header";

interface BoundingBox {
  bounds: number[];
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

interface ChestXrayLayoutProps {
  signOut: () => void;
}

const ChestXrayLayout: React.FC<ChestXrayLayoutProps> = ({
  signOut,
}: ChestXrayLayoutProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [results, setResults] = useState<
    AnalysisResults | AnalysisError | null
  >(null);
  const toast = useToast();

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:8000/chest_xray_analysis/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload and analyze the image.");
      }

      const data: AnalysisResults | AnalysisError = await response.json();

      if ("error" in data) {
        throw new Error(data.error);
      }

      console.log(data);
      setResults(data);
    } catch (error: any) {
      setError(error.message || "Failed to upload image.");
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsUploading(false);
  };

  return (
    <Box w="100vw" h="100vh" bg="gray.100">
      <Header headerText="Chest X-Ray Analysis" signOut={signOut} />
      <Box
        p={4}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {results === null ? (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            handleUpload={handleUpload}
            isUploading={isUploading}
          />
        ) : (
          <ChestXray results={results} selectedFile={selectedFile} />
        )}
      </Box>
    </Box>
  );
};

export default ChestXrayLayout;
