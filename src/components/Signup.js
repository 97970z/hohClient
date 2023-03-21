import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./header/Header";
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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailChecked, setEmailChecked] = useState(false);

  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailCheck = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/check-email", { email });
      setEmailChecked(res.data.message === "Email is available");
      setLoading(false);
      setError(res.data.message);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setError("Error checking email.");
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
      setError("All fields are required.");
      setLoading(false);
      return false;
    }

    if (name.length < 4 || name.length > 12) {
      setError("Name must be between 4 and 12 characters long.");
      setLoading(false);
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return false;
    }

    if (password.length < 8) {
      setError("Password should be at least 8 characters long.");
      setLoading(false);
      return false;
    }

    return true;
  };

  return (
    <Container className="my-4">
      <Header />
      <Row className="justify-content-center mt-5">
        <Col lg={6} md={8} sm={12}>
          <Card>
            <Card.Header>
              <h1>Sign Up</h1>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email</Form.Label>
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
                        "Check Email"
                      )}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="confirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
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
                    "Sign Up"
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
                    "Login"
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
