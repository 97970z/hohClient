import React, { useState } from "react";
import axios from "axios";
import { Header } from "./header/Header";
import {
  Container,
  Form,
  Button,
  InputGroup,
  Card,
  ListGroup,
} from "react-bootstrap";

const api_key = process.env.REACT_APP_OPENAI;

const OpenAIChatbot = () => {
  const [history, setHistory] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const startNewConversation = () => {
    setHistory([]);
    setConversation([]);
    setInputMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt_msg = {
      role: "user",
      content: inputMessage,
    };

    const data = {
      model: "gpt-3.5-turbo",
      messages: history.concat([prompt_msg]),
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${api_key}`,
        },
      }
    );

    const responseMessage = response.data.choices[0].message;

    setHistory(history.concat([prompt_msg, responseMessage]));
    setConversation(
      conversation.concat([inputMessage, responseMessage.content])
    );
    setInputMessage("");
  };

  return (
    <Container>
      <h1 className="mt-3">ChatGPT bot</h1>
      <Header />
      <Card className="mb-4" style={{ minHeight: "400px" }}>
        <ListGroup variant="flush">
          {conversation.map((message, index) => (
            <ListGroup.Item key={index}>
              <strong>{index % 2 === 0 ? "User: " : "Chatbot: "}</strong>
              {message}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="userMessage">
          <InputGroup>
            <Form.Control
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Enter text and press enter"
            />

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </InputGroup>
        </Form.Group>
        <Button variant="secondary" onClick={startNewConversation}>
          Start a new conversation
        </Button>
      </Form>
    </Container>
  );
};

export default OpenAIChatbot;
