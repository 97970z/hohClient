import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Helmet } from "./header/Header";
import {
  Container,
  Row,
  Col,
  Card,
  InputGroup,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const Signup = () => {
  const navigate = useNavigate();
  const [emailChecked, setEmailChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailCheck = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/check-email", { email });
      setEmailChecked(res.data.message === "사용 가능한 이메일입니다.");
      setError(res.data.message);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isInputValid()) {
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshtoken", res.data.refreshToken);
      localStorage.setItem("accessTokenExp", res.data.accessTokenExp);
      localStorage.setItem("refreshTokenExp", res.data.refreshTokenExp);
      setLoading(false);
      navigate("/email-sent");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleLink = () => {
    navigate("/login");
  };

  const isInputValid = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("모든 항목을 입력해주세요.");
      setLoading(false);
      return false;
    }

    if (name.length < 4 || name.length > 12) {
      setError("이름은 4자 이상 12자 이하로 입력해주세요.");
      setLoading(false);
      return false;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      setLoading(false);
      return false;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상으로 입력해주세요.");
      setLoading(false);
      return false;
    }

    return true;
  };

  return (
    <Container className="my-4">
      <Helmet>
        <title>과제 도우미 || 회원가입</title>
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
        <Col lg={6} md={8} sm={12}>
          <Card>
            <Card.Header>
              <h1>회원가입</h1>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>이메일</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      name="email"
                      value={email}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      variant="outline-info"
                      onClick={handleEmailCheck}
                      disabled={loading || !email}
                      style={{ marginLeft: "10px" }}
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" role="status">
                          <span className="visually-hidden">Checking...</span>
                        </Spinner>
                      ) : (
                        "이메일 확인"
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>비밀번호 확인</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  disabled={loading || !emailChecked}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    "회원가입"
                  )}
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={handleLink}
                  disabled={loading}
                  style={{ marginLeft: "10px" }}
                >
                  {loading ? (
                    <Spinner animation="border" size="sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    "로그인"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
