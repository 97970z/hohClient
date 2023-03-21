import React from "react";
import { Header } from "./header/Header";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EmailSent = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/login");
  };

  return (
    <Container className="my-4">
      <Header />
      <Row className="justify-content-center mt-5">
        <Col lg={6} md={8} sm={12}>
          <Card>
            <Card.Header>
              <h1>Email Sent</h1>
            </Card.Header>
            <Card.Body>
              <p>
                We have sent a verification email to the address you provided.
                Please check your inbox and click on the verification link to
                complete the registration process.
              </p>
              <Button variant="primary" onClick={handleClick}>
                Go to Login
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EmailSent;
