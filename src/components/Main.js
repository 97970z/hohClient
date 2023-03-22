import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header, Helmet } from "./header/Header";
import { checkTokenExpiration } from "./refreshToken/refresh";
import { Loding } from "./Loding/Loding";
import {
  Container,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  Badge,
} from "react-bootstrap";

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await checkTokenExpiration();
        const res = await axios.get("/api/users");
        setLoading(false);
        setUserData(res.data.users);
      } catch (err) {
        setLoading(false);
        setError(err);
      }
    };

    fetchUsers();
  }, []);

  const sortedUserData = userData
    ? [...userData].sort((a, b) => b.points - a.points)
    : null;

  if (loading) {
    <Loding />;
  }

  return (
    <>
      <Container className="my-4">
        <Helmet>
          <title>과제 도우미 || 리더보드</title>
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
        <h1>리더보드</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {sortedUserData && (
          <Row>
            {sortedUserData.map((user, index) => (
              <Col md={4} key={user._id} className="mb-3">
                <Card className="h-100">
                  <Card.Header>
                    <h4>
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : ""}
                      <Badge className="mx-2">{index + 1}</Badge>
                      {user.name}
                    </h4>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>포인트: {user.points}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </>
  );
};

export default Main;
