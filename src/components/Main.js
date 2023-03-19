import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "./header/Header";
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
    axios
      .get("/api/users")
      .then((res) => {
        setLoading(false);
        setUserData(res.data.users);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, []);

  const sortedUserData = userData
    ? [...userData].sort((a, b) => b.points - a.points)
    : null;

  if (loading) {
    return <Loding />;
  }

  return (
    <>
      <Container className="my-4">
        <Header />
        <h1>Leaderboard</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && (
          <div className="d-flex justify-content-center align-items-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}
        {sortedUserData && Array.isArray(sortedUserData) && (
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
                    <Card.Title>Email: {user.email}</Card.Title>
                    <Card.Text>Points: {user.points}</Card.Text>
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
