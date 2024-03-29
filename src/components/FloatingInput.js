import React, { useState, useEffect } from "react";
import axios from "axios";
import { AceEditor } from "./header/Header";
import { checkTokenExpiration } from "./refreshToken/refresh";
import { Button, Form, Card, Modal } from "react-bootstrap";

const FloatingInput = ({
  title: assignmentTitle,
  assignmentId,
  selectedAnswers,
  setSelectedAnswers,
  showInput,
  setShowInput,
}) => {
  const [answer, setAnswer] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const fetchAuthor = async () => {
      const isTokenRefreshed = await checkTokenExpiration();

      if (isTokenRefreshed) {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        try {
          const res = await axios.get("/api/auth/me", config);
          setAuthor(res.data._id);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchAuthor();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAnswer = {
      content: answer,
      author,
      assignment: assignmentId,
    };

    try {
      const response = await axios.post("/api/assignments/answer", newAnswer);
      const savedAnswer = response.data;
      const updatedAnswers = selectedAnswers
        ? [...selectedAnswers, savedAnswer]
        : [savedAnswer];
      setSelectedAnswers(updatedAnswers);
      setShowInput(false);
    } catch (err) {
      console.error(err);
    }
    setAnswer("");
  };

  const handleCancel = () => {
    setShowInput(false);
  };

  return (
    <Modal show={showInput} onHide={handleCancel} centered>
      <Card>
        <Card.Header>선택한 질문: {assignmentTitle}</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formAnswer">
              <AceEditor
                mode="javascript"
                theme="monokai"
                setOptions={{
                  useWorker: false,
                }}
                style={{ width: "100%", height: "100px" }}
                value={answer}
                onChange={(answer) => setAnswer(answer)}
              />
            </Form.Group>
            <Button type="submit" className="me-2">
              등록
            </Button>
            <Button variant="secondary" onClick={handleCancel}>
              취소
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Modal>
  );
};

export default FloatingInput;
