import {
  Box,
  Flex,
  IconButton,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { FaHome, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useUser } from "./UserContext"; // Import the useUser hook

interface HeaderProps {
  headerText: string;
  signOut: () => void;
}

const Header: React.FC<HeaderProps> = ({
  headerText,
  signOut,
}: HeaderProps) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { username } = useUser(); // Get the username from the context

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Box bg="gray.700" color="white" py={4}>
      <Flex justifyContent="space-between" alignItems="center" px={4}>
        <IconButton
          aria-label="Home"
          icon={<FaHome />}
          onClick={handleHomeClick}
          colorScheme="transparent"
          _focus={{ boxShadow: "none", outline: "none" }}
        />
        <Text textAlign="center" flex="1">
          {headerText}
        </Text>
        <IconButton
          aria-label="Account"
          icon={<FaUser />}
          onClick={onOpen}
          colorScheme="transparent"
          _focus={{ boxShadow: "none", outline: "none" }}
        />
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Account</ModalHeader>
          <ModalBody>
            <Text>Username</Text>
            <Text fontWeight="bold">{username}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => signOut()}
              _focus={{ boxShadow: "none", outline: "none" }}
            >
              Logout
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              _focus={{ boxShadow: "none", outline: "none" }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Header;
