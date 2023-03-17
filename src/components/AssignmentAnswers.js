import React, { useState, useEffect } from "react";
import axios from "axios";
import FloatingInput from "./FloatingInput";
import { Header, AceEditor } from "./header/Header";
import {
  Tab,
  Tabs,
  Button,
  Card,
  Modal,
  Form,
  FormControl,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";

const AssignmentAnswers = () => {
  const isLoggedIn = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [numAssignments, setNumAssignments] = useState(10);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [stateExpanded, setStateExpanded] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [show, setShow] = useState(false);
  const [searchType, setSearchType] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setLoading(true);
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
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        };
        try {
          const { data } = await axios.get(`/api/auth/me`, config);
          setLoggedInUser(data._id);
        } catch (err) {
          console.error(err);
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

  const handleMore = () => {
    setNumAssignments(numAssignments + 10);
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
    }
  };

  const toggleInput = (id) => {
    setShowInput(!showInput);
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

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Assignment Answers</h1>
      <Header />
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <div className="d-flex mb-5">
        <InputGroup className="mr-3">
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
      </div>

      {/* {sortedAssignments.slice(0, numAssignments).map((assignment) => ( */}
      {filteredAssignments.slice(0, numAssignments).map((assignment) => (
        <Card key={assignment._id} className="mb-4 shadow">
          {expandedAssignmentId === assignment._id && isLoggedIn && (
            <>
              <div className="d-flex my-3">
                {assignment.author === loggedInUser ? (
                  <Button
                    variant="outline-danger"
                    className="mr-2"
                    onClick={handleShow}
                  >
                    Delete
                  </Button>
                ) : null}
                <Button variant="outline-primary" onClick={toggleInput}>
                  Register
                </Button>
              </div>
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
            </>
          )}
          <Card.Body>
            <Card.Title
              className="d-flex justify-content-between align-items-center"
              onClick={() => handleExpandClick(assignment._id)}
            >
              <span>
                만료일 : {handleExpired(assignment.expiration)} •{" "}
                {assignment.title}
              </span>
              <small className="text-muted">장르 : {assignment.genre}</small>
            </Card.Title>
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
                    </div>
                  </Tab>
                  <Tab eventKey="userAnswer" title="User's Answer">
                    {showInput && (
                      <FloatingInput
                        title={assignment.title}
                        assignmentId={assignment._id}
                        selectedAnswers={selectedAnswers}
                        setSelectedAnswers={setSelectedAnswers}
                      />
                    )}
                    {selectedAnswers.map((answer) => (
                      <div key={`${answer.content}-${answer._id}`}>
                        <hr></hr>
                        <h5>{answer.accepted ? "Best Answer - " : ""}</h5>
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
                        assignments.find((a) => a._id === expandedAssignmentId)
                          .author === loggedInUser ? (
                          <Button
                            variant="outline-primary"
                            className="mr-2"
                            onClick={() => handleAcceptAnswer(answer._id)}
                          >
                            Accept
                          </Button>
                        ) : null}
                      </div>
                    ))}
                  </Tab>
                </Tabs>
              </>
            )}
          </Card.Body>
        </Card>
      ))}

      {numAssignments < assignments.length && (
        <button className="btn btn-primary" onClick={handleMore}>
          More
        </button>
      )}
    </div>
  );
};

export default AssignmentAnswers;
