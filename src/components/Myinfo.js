import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./header/Header";
import { Container, Card, Button, Alert, Spinner } from "react-bootstrap";

const MyInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    axios
      .get("/api/auth/me", config)
      .then((res) => {
        setLoading(false);
        setUser(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        console.error(err);
      });
  }, []);

  return (
    <Container>
      <h1 className="mt-3">My Info</h1>
      <Header />
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {user && (
        <Card className="mt-3">
          <Card.Body>
            <Card.Title>{user.name}</Card.Title>
            <Card.Text>
              <strong>Email:</strong> {user.email}
            </Card.Text>
            <Card.Text>
              <strong>Points:</strong> {user.points}
            </Card.Text>
            <Button
              variant="primary"
              onClick={() => {
                navigate("/edit-info", { state: { user } });
              }}
            >
              Edit
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MyInfo;
