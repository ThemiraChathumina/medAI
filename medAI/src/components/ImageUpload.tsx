import { Box, Center, Text, Button, Input, Image } from "@chakra-ui/react";
import React, { useState } from "react";

interface ImageUploadProps {
  // Add props here
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleUpload: () => void;
  isUploading: boolean;
}

function ImageUpload({
  selectedFile,
  setSelectedFile,
  handleUpload,
  isUploading,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  return (
    <div>
      <Center h="calc(100vh - 72px)">
        <Box
          w="400px"
          bg="gray.500"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={4}
          borderRadius="md"
          boxShadow="md"
          overflow="hidden"
        >
          <Text fontSize="xl" mb={4} color="white">
            Upload Image
          </Text>
          <Button
            as="label"
            htmlFor="file-input"
            size="md"
            bg="blue.500"
            color="white"
            _hover={{ bg: "blue.600" }}
            mb={2}
          >
            Choose File
          </Button>
          <Input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            display="none"
          />
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={selectedFile?.name}
              maxW="100%"
              maxH="300px"
              mt={2}
              borderRadius="md"
            />
          )}
          {selectedFile && (
            <>
              <Text mt={2} color="white">
                Selected file: {selectedFile.name}
              </Text>
              <Button
                size="md"
                bg="green.500"
                color="white"
                _hover={{ bg: "green.600" }}
                mt={4}
                onClick={handleUpload}
                isLoading={isUploading}
                loadingText="Uploading"
              >
                Upload
              </Button>
            </>
          )}
          {!selectedFile && (
            <Text mt={2} color="white">
              No file chosen
            </Text>
          )}
        </Box>
      </Center>
    </div>
  );
}

export default ImageUpload;
