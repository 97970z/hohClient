import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Header, Helmet } from "./header/Header";
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
      setIsUsernameValid(res.data.message === "사용 가능한 이름입니다.");
      setError(res.data.message);
    } catch (err) {
      console.error("err:", err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!isInputValid()) {
      return;
    }

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

  const isInputValid = () => {
    if (!username || !password) {
      setError("모든 항목을 입력해주세요.");
      return false;
    }

    if (username.length < 4 || username.length > 12) {
      setError("이름은 4자 이상 12자 이하로 입력해주세요.");
      return false;
    }

    if (password.length < 8) {
      setError("비밀번호는 8자 이상으로 입력해주세요.");
      return false;
    }

    return true;
  };

  return (
    <Container className="my-4">
      <Helmet>
        <title>과제 도우미 || 내 정보 수정</title>
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
        <Col lg={6}>
          <Card>
            <Card.Header>
              <h1>내 정보 수정</h1>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleEditSubmit}>
                {error && <Alert variant="info">{error}</Alert>}
                <Form.Group controlId="username">
                  <Form.Label>이름</Form.Label>
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
                      중복확인
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group controlId="password">
                  <Form.Label>새로운 비밀번호</Form.Label>
                  <InputGroup>
                    <FormControl
                      type={isPasswordVisible ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      required
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
                  저장
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
