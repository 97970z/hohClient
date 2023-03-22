import React from "react";
import { Header, Helmet } from "./header/Header";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EmailSent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <Container className="my-4">
      <Helmet>
        <title>과제 도우미 || 이메일 인증</title>
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
              <h1>이메일 전송 완료</h1>
            </Card.Header>
            <Card.Body>
              <p>
                입력하신 이메일 주소로 인증 이메일을 전송했습니다. 이메일을
                확인하신 후 인증 링크를 클릭하여 회원가입을 완료해주세요.
              </p>
              <Button variant="primary" onClick={handleClick}>
                로그인 페이지로 이동
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailSent;
