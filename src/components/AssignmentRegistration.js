import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Header, AceEditor, Helmet } from "./header/Header";
import { checkTokenExpiration } from "./refreshToken/refresh";
import { Loding } from "./Loding/Loding";
import {
  Container,
  Form,
  Button,
  Alert,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const AssignmentRegistration = () => {
  const navigate = useNavigate();
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const date = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const nowDate = `${year}-${month}-${date}T${hour}:${minute}`;

  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [expiration, setExpiration] = useState("");
  const [content, setContent] = useState("");
  const [points, setPoints] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [useGPT, setUseGPT] = useState(true);

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
          const { data } = await axios.get(`/api/auth/me`, config);
          setLoading(false);
          setAuthor(data._id);
        } catch (err) {
          setLoading(false);
          setError(err);
          console.error(err);
        }
      } else {
        setLoading(false);
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

      let gptanswer = "ChatGPT는 쉬고 있습니다...";

      if (useGPT) {
        gptanswer = await axios
          .post(apiEndpoint, requestData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
          })
          .then((response) => {
            return response.data.choices[0].message.content;
          })
          .catch((err) => {
            console.error(err);
            return "현재 ChatGPT 서버에 문제가 있어서 답변을 받아올 수 없습니다.";
          });
      }

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

  const handleCheckboxChange = (e) => {
    setUseGPT(e.target.checked);
  };

  if (loading) {
    return <Loding />;
  }

  return (
    <Container className="my-4">
      <Helmet>
        <title>과제 도우미 || 질문 등록</title>
        <meta
          name="google-site-verification"
          content="과제 도우미에서 질문하고 답변해보세요. ChatGPT의 답변도 과제 도우미에서 받을 수 있습니다."
        />
        <meta
          name="naver-site-verification"
          content="과제 도우미에서 질문하고 답변해보세요. ChatGPT의 답변도 과제 도우미에서 받을 수 있습니다."
        />
      </Helmet>
      <Header />
      <Row className="justify-content-center mt-5">
        <Col lg={8}>
          <Card className="mt-5">
            <Card.Header>
              <h1>질문 등록</h1>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {isLoading && useGPT ? (
                <>
                  <h4 className="d-flex justify-content-center align-items-center">
                    ChatGPT에게 질문하는 중입니다.
                  </h4>
                  <Loding />
                </>
              ) : (
                <Form onSubmit={onSubmit}>
                  <Form.Group controlId="title">
                    <Form.Label>제목</Form.Label>
                    <Form.Control
                      type="text"
                      minLength="5"
                      maxLength="50"
                      value={title}
                      placeholder="제목을 입력하세요."
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="author">
                    <Form.Label>작성자</Form.Label>
                    <Form.Control
                      type="text"
                      value={author}
                      disabled
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="genre">
                    <Form.Label>카테고리</Form.Label>
                    <Form.Control
                      as="select"
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      required
                    >
                      <option value="">질문 종류를 선택하세요.</option>
                      <option value="coding">코딩</option>
                      <option value="writing">기타</option>
                    </Form.Control>
                  </Form.Group>
                  {genre === "coding" && (
                    <Form.Group controlId="language">
                      <Form.Label>프로그래밍 언어</Form.Label>
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
                    <Form.Label>만료일</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      min={nowDate}
                      value={expiration}
                      onChange={(e) => setExpiration(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="content">
                    <Form.Label>내용</Form.Label>
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
                    <Form.Label>현상포인트</Form.Label>
                    <Form.Control
                      type="number"
                      value={points}
                      min="1"
                      max="5"
                      placeholder="해결포인트를 입력하세요. (1~5)"
                      onChange={(e) => setPoints(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <hr></hr>
                  <Form.Group controlId="useGPT">
                    <Form.Check
                      type="checkbox"
                      label="ChatGPT를 이용하여 답변을 받으시겠습니까? (질문 내용에 따라 시간이 오래 걸릴 수 있습니다.)"
                      checked={useGPT}
                      onChange={handleCheckboxChange}
                    />
                  </Form.Group>
                  <hr></hr>
                  <Button
                    variant="outline-primary"
                    className="mr-2"
                    type="submit"
                  >
                    작성
                  </Button>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AssignmentRegistration;
