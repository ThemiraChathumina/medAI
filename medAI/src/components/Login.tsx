import { Box, Button, Text, Center, VStack } from "@chakra-ui/react";
import React from "react";

interface LoginProps {
  signIn: () => void;
}

const Login: React.FC<LoginProps> = ({ signIn }: LoginProps) => {
  return (
    <Box
      w="100vw"
      h="100vh"
      bgGradient="linear(to-r, lightblue, white)"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Center flex="1">
        <VStack spacing={8}>
          <Text
            fontSize="4xl"
            fontWeight="bold"
            textAlign="center"
            color="teal.700"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.2)"
          >
            Analyse Medical Images with AI
          </Text>
          <Button
            size="lg"
            colorScheme="teal"
            variant="solid"
            _hover={{ bg: "teal.600", transform: "scale(1.05)" }}
            _focus={{ boxShadow: "none", outline: "none" }}
            onClick={() => signIn()}
          >
            Sign In
          </Button>
        </VStack>
      </Center>
    </Box>
  );
};

export default Login;
