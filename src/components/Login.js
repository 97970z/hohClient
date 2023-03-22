import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Header, Helmet } from "./header/Header";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("refreshtoken", res.data.refreshToken);
      localStorage.setItem("accessTokenExp", res.data.accessTokenExp);
      localStorage.setItem("refreshTokenExp", res.data.refreshTokenExp);
      setLoading(false);
      navigate("/main");
    } catch (err) {
      setLoading(false);
      setError(err.response.data.msg);
    }
  };

  const handleLink = () => {
    navigate("/register");
  };

  return (
    <Container className="my-4">
      <Helmet>
        <title>과제 도우미 || 로그인</title>
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
              <h1>로그인</h1>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>이메일</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>비밀번호</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="me-3"
                  variant="outline-primary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "로그인"}
                </Button>
                <Button
                  type="button"
                  onClick={handleLink}
                  variant="outline-secondary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "회원가입"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
