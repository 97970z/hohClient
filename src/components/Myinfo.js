import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./header/Header";
import { Loding } from "./Loding/Loding";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  ListGroup,
  Badge,
} from "react-bootstrap";

const MyInfo = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentAnswers, setAssignmentAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/assignments");
      const filteredAssignments = res.data.filter((assignment) => {
        return assignment.author === user._id;
      });
      setAssignments(filteredAssignments);

      const answers = [];
      for (let i = 0; i < filteredAssignments.length; i++) {
        const res = await axios.get(
          `/api/assignments/${filteredAssignments[i]._id}/answers`
        );
        answers.push(res.data);
      }
      setAssignmentAnswers(answers);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <Loding />;
  }

  return (
    <>
      <Container className="my-4">
        <Header />
        <h1>My Info</h1>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Loding />}
        {user && (
          <>
            <Row>
              <Col md={4}>
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
              </Col>
              <Col md={8}>
                <h2>My Assignments</h2>
                {assignments.map((assignment, index) => (
                  <Card key={assignment._id} className="mb-3">
                    <Card.Header>
                      <strong>Assignment {index + 1}</strong>{" "}
                      <Badge variant="secondary">{assignment.title}</Badge>
                    </Card.Header>
                    <Card.Body>
                      {assignmentAnswers[index] && (
                        <ListGroup>
                          {assignmentAnswers[index].map((answer) => (
                            <ListGroup.Item key={answer._id}>
                              {answer.content}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default MyInfo;
