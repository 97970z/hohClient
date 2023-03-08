import React, { useState } from "react";
import axios from "axios";
import Header from "./header/Header";

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
    <div className="container">
      <h1>ChatGPT bot</h1>
      <Header />
      <div style={{ minHeight: "400px" }}>
        {conversation.map((message, index) => (
          <div key={index}>
            {index % 2 === 0 ? "User: " : "Chatbot: "}
            {message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter text and press enter"
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={startNewConversation}>
          Start a new conversation
        </button>
      </form>
    </div>
  );
};

export default OpenAIChatbot;
