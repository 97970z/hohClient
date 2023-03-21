import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./header/Header";
import { checkTokenExpiration } from "./refreshToken/refresh";
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
  Pagination,
} from "react-bootstrap";

const MyInfo = () => {
  const [assignments, setAssignments] = useState([]);
  const [assignmentAnswers, setAssignmentAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const assignmentsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await checkTokenExpiration();
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        const res = await axios.get("/api/auth/me", config);
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
        console.error(err);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchAssignments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get("/api/assignments");
      const filteredAssignments = res.data
        .filter((assignment) => {
          return assignment.author === user._id;
        })
        .sort((a, b) => {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
      setAssignments(filteredAssignments);

      const answerPromises = filteredAssignments.map((assignment) => {
        return axios.get(`/api/assignments/${assignment._id}/answers`);
      });

      const answerResponses = await Promise.all(answerPromises);
      const answers = answerResponses.map((res) => res.data);
      setAssignmentAnswers(answers);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  function truncateString(str, maxLength) {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
  }

  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = assignments.slice(
    indexOfFirstAssignment,
    indexOfLastAssignment
  );

  const totalPages = Math.ceil(assignments.length / assignmentsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    <Loding />;
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
                {currentAssignments.map((assignment, index) => (
                  <Card key={assignment._id} className="mb-3">
                    <Card.Header>
                      <strong>Assignment {index + 1}</strong>{" "}
                      <Badge variant="secondary">
                        {truncateString(assignment.title, 30)}
                      </Badge>
                    </Card.Header>
                    <Card.Body>
                      {assignmentAnswers[index] && (
                        <ListGroup>
                          {assignmentAnswers[index].length === 0 && (
                            <ListGroup.Item>
                              아직 해당 질문에 대한 답변이 없습니다.
                            </ListGroup.Item>
                          )}
                          {assignmentAnswers[index].map((answer) => (
                            <ListGroup.Item key={answer._id}>
                              {truncateString(answer.content, 100)}
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      )}
                    </Card.Body>
                  </Card>
                ))}
                <Pagination>
                  <Pagination.First onClick={() => handlePageClick(1)} />
                  <Pagination.Prev
                    onClick={() =>
                      handlePageClick(currentPage > 1 ? currentPage - 1 : 1)
                    }
                  />
                  {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageClick(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() =>
                      handlePageClick(
                        currentPage < totalPages ? currentPage + 1 : totalPages
                      )
                    }
                  />
                  <Pagination.Last
                    onClick={() => handlePageClick(totalPages)}
                  />
                </Pagination>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default MyInfo;
