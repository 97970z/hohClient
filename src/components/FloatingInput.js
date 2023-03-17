import React, { useState, useEffect } from "react";
import axios from "axios";
import { AceEditor } from "./header/Header";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";

const FloatingInput = ({
  title: assignmentTitle,
  assignmentId,
  selectedAnswers,
  setSelectedAnswers,
}) => {
  const [answer, setAnswer] = useState("");
  const [author, setAuthor] = useState("");
  const [showInput, setShowInput] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
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
      await axios.post("/api/assignments/answer", newAnswer);
      const updatedAnswers = selectedAnswers
        ? [...selectedAnswers, newAnswer]
        : [newAnswer];
      setSelectedAnswers(updatedAnswers);
      setShowInput(false);
      console.log(selectedAnswers);
    } catch (err) {
      console.error(err);
    }
    setAnswer("");
  };

  const handleCancel = () => {
    setShowInput(false);
  };

  return (
    <Container fluid className="fixed-bottom mb-4">
      {showInput && (
        <Row className="justify-content-center">
          <Col lg={8} md={10} sm={12}>
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
                    Register
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FloatingInput;
