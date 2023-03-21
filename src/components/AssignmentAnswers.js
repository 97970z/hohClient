import React, { useState, useEffect } from "react";
import axios from "axios";
import FloatingInput from "./FloatingInput";
import { Header, AceEditor } from "./header/Header";
import { checkTokenExpiration } from "./refreshToken/refresh";
import { Loding } from "./Loding/Loding";
import {
  Container,
  Tab,
  Tabs,
  Button,
  Card,
  Modal,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Alert,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";

const AssignmentAnswers = () => {
  const isLoggedIn = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [stateExpanded, setStateExpanded] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [show, setShow] = useState(false);
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const assignmentsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/assignments");
        setLoading(false);
        setAssignments(result.data);

        if (localStorage.getItem("token")) {
          setIsAuthenticated(true);
        }
      } catch (err) {
        setLoading(false);
        setError(err);
        console.error(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLoggedInUser = async () => {
        const isTokenRefreshed = await checkTokenExpiration();

        if (isTokenRefreshed) {
          const token = localStorage.getItem("token");
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          };
          try {
            const { data } = await axios.get(`/api/auth/me`, config);
            setLoading(false);
            setLoggedInUser(data._id);
          } catch (err) {
            setLoading(false);
            console.error(err);
          }
        }
      };
      fetchLoggedInUser();
    }
  }, [isAuthenticated]);

  const handleExpandClick = async (id) => {
    if (id === expandedAssignmentId) {
      setExpandedAssignmentId(null);
      toggleExpanded();
    } else {
      setExpandedAssignmentId(id);
      toggleExpanded();
      setSelectedAnswers([]);

      const assignment = assignments.find((a) => a._id === id);
      if (assignment.answers.length > 0) {
        const answers = await Promise.all(
          assignment.answers.map(async (answerId) => {
            const { data } = await axios(`/api/assignments/answer/${answerId}`);
            return data;
          })
        );
        setSelectedAnswers(answers);
      }
    }
  };

  const handleExpired = (date) => {
    const newEx = date;
    if (newEx.length >= 10) {
      return newEx.substring(0, 10);
    }
    return newEx;
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    try {
      await axios.delete(`/api/assignments/${expandedAssignmentId}`, config);
      const newAssignments = assignments.filter(
        (a) => a._id !== expandedAssignmentId
      );
      setAssignments(newAssignments);
      setExpandedAssignmentId(null);
      setShow(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAnswer = async (answer) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    try {
      await axios.delete(`/api/assignments/answer/${answer._id}`, config);
      setSelectedAnswers((prevAnswers) =>
        prevAnswers.filter((a) => a._id !== answer._id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    try {
      await axios.put(`/api/assignments/answer/${answerId}/accept`, {}, config);

      const newAnswers = selectedAnswers.map((answer) => {
        if (answer._id === answerId) {
          return { ...answer, accepted: true };
        }
        return answer;
      });
      setSelectedAnswers(newAnswers.sort((a, b) => b.accepted - a.accepted));
    } catch (err) {
      console.error(err);
      alert("There was an issue accepting the answer. Please try again.");
    }
  };

  const toggleExpanded = () => {
    setStateExpanded(!stateExpanded);
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    const hasBestAnswer = selectedAnswers.some((answer) => answer.accepted);

    if (!hasBestAnswer) {
      setShow(true);
    } else {
      alert("You cannot delete an assignment with an accepted answer.");
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const pad = (num) => (num < 10 ? "0" + num : num);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const filterAssignments = (assignments) => {
    if (!searchTerm) {
      return assignments;
    }

    return assignments.filter((assignment) => {
      if (searchType === "title") {
        return assignment.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchType === "content") {
        return assignment.content
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      } else if (searchType === "title+content") {
        return (
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return false;
    });
  };

  const sortedAssignments = assignments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const filteredAssignments = filterAssignments(sortedAssignments);

  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = filteredAssignments.slice(
    indexOfFirstAssignment,
    indexOfLastAssignment
  );

  const totalPages = Math.ceil(filteredAssignments.length / assignmentsPerPage);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    <Loding />;
  }

  return (
    <Container className="my-4">
      <Header />
      <h1 className="text-center mb-4">Assignment Answers</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Loding />}
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <InputGroup className="mb-4">
            <FormControl
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <Form.Control
              as="select"
              value={searchType}
              onChange={handleSearchTypeChange}
              style={{ maxWidth: "150px", textAlign: "center" }}
            >
              <option value="title">Title</option>
              <option value="content">Content</option>
              <option value="title+content">Title + Content</option>
            </Form.Control>
          </InputGroup>
        </Col>
      </Row>

      {currentAssignments.map((assignment) => (
        <Card key={assignment._id} className="mb-4 shadow">
          {expandedAssignmentId === assignment._id && isLoggedIn && (
            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Delete Assignment</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                과제를 삭제하시겠습니까? 삭제하면 되돌릴 수 없습니다.
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleDelete}>
                  Delete
                </Button>
              </Modal.Footer>
            </Modal>
          )}
          <Card.Body>
            <div onClick={() => handleExpandClick(assignment._id)}>
              <Card.Title className="d-flex justify-content-between align-items-center">
                <span>{assignment.title}</span>

                <small className="text-muted">
                  {assignment.genre === "writing"
                    ? "other than coding"
                    : assignment.genre}{" "}
                </small>
              </Card.Title>
              <div className="d-flex justify-content-between align-items-center">
                <p className="card-subtitle mb-2">
                  작성일: {formatDate(assignment.createdAt)}
                </p>
                <p className="card-subtitle mb-2">
                  만료일: {formatDate(assignment.expiration)}
                </p>
              </div>
            </div>
            {expandedAssignmentId === assignment._id && (
              <>
                <p className="card-subtitle">Points: {assignment.points}</p>
                <p className="card-subtitle">
                  Expiration: {handleExpired(assignment.expiration)}
                </p>
                <div className="card-text">
                  <AceEditor
                    mode={
                      assignment.genre === "writing" ? "text" : assignment.genre
                    }
                    theme="github"
                    value={assignment.content}
                    setOptions={{
                      useWorker: false,
                      readOnly: true,
                      wrap: true,
                    }}
                    style={{ width: "100%", height: "200px" }}
                  />
                </div>
                {assignment.author === loggedInUser ? (
                  <Button
                    variant="danger"
                    size="sm"
                    className="py-0"
                    onClick={handleShow}
                  >
                    Delete
                  </Button>
                ) : null}
                <hr></hr>
                <Tabs
                  defaultActiveKey="gptAnswer"
                  id={`answerTabs-${assignment._id}`}
                >
                  <Tab eventKey="gptAnswer" title="ChatGPT's Answer">
                    <div className="card-text">
                      <AceEditor
                        mode={
                          assignment.genre === "writing"
                            ? "text"
                            : assignment.genre
                        }
                        theme="solarized_light"
                        value={assignment.gptanswer}
                        setOptions={{
                          useWorker: false,
                          readOnly: true,
                          wrap: true,
                        }}
                        style={{ width: "100%", height: "150px" }}
                      />
                      {/* <Chatbot /> */}
                    </div>
                  </Tab>
                  <Tab eventKey="userAnswer" title="User's Answer">
                    {showInput && (
                      <FloatingInput
                        title={assignment.title}
                        assignmentId={assignment._id}
                        selectedAnswers={selectedAnswers}
                        setSelectedAnswers={setSelectedAnswers}
                        showInput={showInput}
                        setShowInput={setShowInput}
                      />
                    )}
                    <ListGroup variant="flush">
                      {selectedAnswers
                        .sort((a, b) =>
                          a.accepted === b.accepted ? 0 : a.accepted ? -1 : 1
                        )
                        .map((answer) => (
                          <ListGroup.Item
                            key={`${answer.content}-${answer._id}`}
                            className="border rounded mb-3"
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              {answer.accepted && (
                                <span className="badge rounded-pill bg-success text-white">
                                  Best Answer
                                </span>
                              )}
                              <small className="text-muted">
                                작성일: {formatDate(answer.createdAt)}
                              </small>
                            </div>
                            <div className="mt-2 mb-3">
                              <AceEditor
                                mode={
                                  assignment.genre === "writing"
                                    ? "text"
                                    : assignment.genre
                                }
                                theme="solarized_light"
                                value={answer.content}
                                setOptions={{
                                  useWorker: false,
                                  readOnly: true,
                                }}
                                style={{ width: "100%", height: "150px" }}
                              />
                            </div>
                            <div className="d-flex justify-content-end">
                              {answer.author === loggedInUser ? (
                                <>
                                  <Button
                                    variant="outline-danger"
                                    className="mr-2"
                                    onClick={() => handleDeleteAnswer(answer)}
                                  >
                                    Delete
                                  </Button>
                                </>
                              ) : null}
                              {expandedAssignmentId &&
                              isLoggedIn &&
                              assignments.find(
                                (a) => a._id === expandedAssignmentId
                              ).author === loggedInUser &&
                              !answer.accepted ? (
                                <Button
                                  variant="outline-primary"
                                  className="mr-2"
                                  onClick={() => handleAcceptAnswer(answer._id)}
                                >
                                  Accept
                                </Button>
                              ) : null}
                            </div>
                          </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <Card.Footer className="text-right">
                      <Button
                        variant="primary"
                        onClick={() => setShowInput(true)}
                      >
                        Submit Answer
                      </Button>
                    </Card.Footer>
                  </Tab>
                </Tabs>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
      <Row className="mt-4">
        <Col className="text-center">
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
            <Pagination.Last onClick={() => handlePageClick(totalPages)} />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default AssignmentAnswers;
