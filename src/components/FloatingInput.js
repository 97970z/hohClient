import React, { useState, useEffect } from "react";
import axios from "axios";
import AceEditor from "react-ace";
import { Button, Form } from "react-bootstrap";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const FloatingInputStyle = {
  backgroundColor: "white",
  padding: "1rem",
  border: "1px solid black",
  borderRadius: "5px",
};

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
      setSelectedAnswers([...selectedAnswers, newAnswer]);
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
    <div className="fixed-bottom">
      {showInput && (
        <div className="container" style={FloatingInputStyle}>
          <div className="row">
            <div className="col-12">
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formAnswer">
                  선택한 질문 : {assignmentTitle}
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingInput;
