import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "./header/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Container,
  Form,
  Button,
  Alert,
  InputGroup,
  FormControl,
  Card,
  Row,
  Col,
} from "react-bootstrap";

const EditInfo = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state.user;

  useEffect(() => {
    setUsername(user.name);
  }, [user]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError("");
    setIsUsernameValid(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevValue) => !prevValue);
  };

  const handleDuplicateCheck = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get(`/api/auth/check-name/${username}`);
      setIsUsernameValid(res.data.message === "Username is available");
      setError(res.data.message);
    } catch (err) {
      console.error("err:", err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };

      const data = { name: username };
      if (password) {
        data.password = password;
      }
      const res = await axios.put(`/api/users/${user._id}`, data, config);
      console.log(res.data);
      navigate("/my-info");
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data);
    }
  };

  return (
    <Container className="my-4">
      <Header />
      <Row className="justify-content-center mt-5">
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h1>Edit User Information</h1>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleEditSubmit}>
                <Form.Group controlId="username">
                  <Form.Label>Username</Form.Label>
                  <InputGroup>
                    <FormControl
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={handleDuplicateCheck}
                    >
                      Check
                    </Button>
                  </InputGroup>
                  {error && <Alert variant="info">{error}</Alert>}
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>New Password</Form.Label>
                  <InputGroup>
                    <FormControl
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={togglePasswordVisibility}
                    >
                      {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Button
                  type="submit"
                  variant="outline-primary"
                  disabled={!isUsernameValid}
                >
                  Save Changes
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditInfo;
