import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Header } from "./header/Header";
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
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
      <Header />
      <Row className="justify-content-center mt-5">
        <Col lg={6} md={8} sm={12}>
          <Card>
            <Card.Header>
              <h1>Login</h1>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
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
                  {loading ? "Loading..." : "Login"}
                </Button>
                <Button
                  type="button"
                  onClick={handleLink}
                  variant="outline-secondary"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Sign up"}
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
