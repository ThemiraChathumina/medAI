import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Remarkable } from "remarkable";

const md = new Remarkable();

export const markdownToHtml = (markdown: string): string => {
  return md.render(markdown);
};

interface User {
  id: string;
  name: string;
}

interface Message {
  text: string;
  user: User;
}

interface ChatProps {
  userId: string;
  initialPrompt: string;
}

const Chat: React.FC<ChatProps> = ({ userId, initialPrompt }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/initialize_chat/",
          new URLSearchParams({ user_id: userId }), // Send as form-encoded data
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );
        setToken(response.data.token);

        // Send the hardcoded initial message
        const initialMessageResponse = await axios.post(
          "http://localhost:8000/respond_message/",
          new URLSearchParams({
            token: response.data.token,
            message: initialPrompt,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        const initialMessage: Message = {
          text: markdownToHtml(initialMessageResponse.data.response),
          user: {
            id: "bot",
            name: "Bot",
          },
        };

        setMessages([initialMessage]);
      } catch (error) {
        console.error("Error initializing chat:", error);
        toast({
          title: "Error",
          description: "Unable to initialize chat.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    initializeChat();
  }, [userId, initialPrompt, toast]);

  const sendMessage = async (text: string): Promise<void> => {
    const userMessage: Message = {
      text,
      user: {
        id: userId,
        name: "User",
      },
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);
    setInputValue("");

    try {
      const response = await axios.post(
        "http://localhost:8000/respond_message/",
        new URLSearchParams({
          token,
          message: text,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const botMessage: Message = {
        text: markdownToHtml(response.data.response),
        user: {
          id: "bot",
          name: "Bot",
        },
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Unable to send message.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Flex direction="column" h="100%" p={4} bg="gray.100" borderRadius="md">
      <VStack spacing={4} flex={1} overflowY="auto" w="100%">
        {messages.map((message, index) => (
          <Box
            key={index}
            alignSelf={message.user.id === userId ? "flex-end" : "flex-start"}
            bg={message.user.id === userId ? "blue.500" : "gray.300"}
            color={message.user.id === userId ? "white" : "black"}
            p={3}
            borderRadius="md"
            maxW="80%"
            w="fit-content"
          >
            <Text dangerouslySetInnerHTML={{ __html: message.text }} />
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </VStack>
      <HStack spacing={2} mt={4}>
        <Input
          placeholder="Type message here"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputValue.trim()) {
              sendMessage(inputValue);
            }
          }}
          disabled={loading}
        />
        <Button
          onClick={() => sendMessage(inputValue)}
          isLoading={loading}
          isDisabled={inputValue.trim().length === 0 || loading}
          _focus={{ boxShadow: "none", outline: "none" }}
        >
          Send
        </Button>
      </HStack>
    </Flex>
  );
};

export default Chat;
