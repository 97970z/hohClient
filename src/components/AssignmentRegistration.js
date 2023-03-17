import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header, AceEditor } from "./header/Header";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

const AssignmentRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [expiration, setExpiration] = useState("");
  const [content, setContent] = useState("");
  const [points, setPoints] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [isLoading, setIsLoading] = useState(false);

  let date = new Date();
  let offset = date.getTimezoneOffset() * 60000;
  let dateOffset = new Date(date.getTime() - offset);
  let dateOffsetString = dateOffset.toISOString().split("T")[0];

  useEffect(() => {
    setLoading(true);
    const fetchAuthor = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      try {
        const { data } = await axios.get(`/api/auth/me`, config);
        setLoading(false);
        setAuthor(data._id);
      } catch (err) {
        setLoading(false);
        setError(err);
        console.error(err);
      }
    };
    fetchAuthor();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const apiEndpoint = "https://api.openai.com/v1/chat/completions";
      const apiKey = process.env.REACT_APP_OPENAI;

      const requestData = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: content }],
      };

      let gptanswer = await axios
        .post(apiEndpoint, requestData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        })
        .then((response) => {
          console.log(response.data.choices[0].message.content);
          return response.data.choices[0].message.content;
        })
        .catch((err) => {
          console.error(err);
          return "현재 ChatGPT 서버에 문제가 있어서 답변을 받아올 수 없습니다.";
        });

      gptanswer = gptanswer.replace(/(.*\n){1,2}/, "");

      let newGenre = genre;
      if (genre === "coding") {
        newGenre = language;
      }
      const newAssignment = {
        title,
        author,
        genre: newGenre,
        expiration,
        createdAt: new Date(),
        content,
        gptanswer,
        points,
      };

      await axios.post("/api/assignments", newAssignment);
      setIsLoading(false);
      navigate("/assignment-answers");
    } catch (err) {
      console.error(err.message);
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="container">
      <h1 className="mb-4">Assignment Registration</h1>
      <Header />
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {isLoading ? (
        <div className="d-flex justify-content-center mt-5">
          <div>ChatGPT에게 물어보는중...</div>
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
        </div>
      ) : (
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              placeholder="제목을 입력하세요."
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="author">
            <Form.Label>Author</Form.Label>
            <Form.Control type="text" value={author} disabled required />
          </Form.Group>
          <Form.Group controlId="genre">
            <Form.Label>Genre</Form.Label>
            <Form.Control
              as="select"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            >
              <option value="">질문 종류를 선택하세요.</option>
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
            </Form.Control>
          </Form.Group>
          {genre === "coding" && (
            <Form.Group controlId="language">
              <Form.Label>Programming Language</Form.Label>
              <Form.Control
                as="select"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="">Select a language</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c_cpp">C/C++</option>
                <option value="java">Java</option>
              </Form.Control>
            </Form.Group>
          )}
          <Form.Group controlId="expiration">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="date"
              value={expiration}
              min={dateOffsetString}
              onChange={(e) => setExpiration(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <AceEditor
              mode={language}
              theme={genre === "coding" ? "monokai" : "github"}
              name="content"
              setOptions={{
                useWorker: false,
              }}
              editorProps={{ $blockScrolling: true }}
              style={{ width: "100%", height: "500px" }}
              value={content}
              onChange={(value) => setContent(value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="points">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              value={points}
              minLength="1"
              maxLength="5"
              placeholder="해결포인트를 입력하세요. (1~5)"
              onChange={(e) => setPoints(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="outline-primary" className="mr-2" type="submit">
            Create
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AssignmentRegistration;
