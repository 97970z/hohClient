import React, { useState, useEffect } from "react";
import axios from "axios";
import AceEditor from "react-ace";
import Header from "./header/Header";
import FloatingInput from "./FloatingInput";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "ace-builds/src-noconflict/mode-text";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";

const AssignmentAnswers = () => {
  const isLoggedIn = localStorage.getItem("token");
  const [author, setAuthor] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [numAssignments, setNumAssignments] = useState(5);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const [stateExpanded, setStateExpanded] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("/api/assignments");
        setAssignments(result.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchAuthor = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      try {
        const { data } = await axios.get(`/api/auth/me`, config);
        setAuthor(data._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthor();
  }, []);

  const handleExpandClick = async (id) => {
    if (id === expandedAssignmentId) {
      setExpandedAssignmentId(null);
      toggleExpanded();
    } else {
      setExpandedAssignmentId(id);
      toggleExpanded();
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
    setNumAssignments(numAssignments + 5);
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

  const toggleInput = (id) => {
    setShowInput(!showInput);
  };

  const toggleExpanded = () => {
    setStateExpanded(!stateExpanded);
  };

  const sortedAssignments = assignments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container">
      <h1>Assignment Answers</h1>
      <Header />
      {sortedAssignments.slice(0, numAssignments).map((assignment) => (
        <div key={assignment._id} className="card mb-3">
          {expandedAssignmentId === assignment._id && isLoggedIn && (
            <>
              <button
                type="button"
                className="btn btn-primary"
                onClick={toggleInput}
              >
                Register
              </button>
              {assignment.author === author && (
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleShow}
                >
                  Delete
                </button>
              )}
              <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Woohoo, you're reading this text in a modal!
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleDelete}>
                    Delete Assignment
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )}
          <div className="card-body">
            <h5
              className="card-title"
              onClick={() => handleExpandClick(assignment._id)}
            >
              {assignment.genre} / {assignment.title}
            </h5>
            <p className="card-subtitle">Points: {assignment.points}</p>
            <p className="card-subtitle">
              Expiration: {handleExpired(assignment.expiration)}
            </p>
            {expandedAssignmentId === assignment._id && (
              <div className="card-text">
                <AceEditor
                  mode="text"
                  theme="github"
                  value={assignment.content}
                  setOptions={{
                    useWorker: false,
                    readOnly: true,
                  }}
                  style={{ width: "100%", height: "300px" }}
                />
                {showInput && (
                  <FloatingInput
                    title={assignment.title}
                    assignmentId={assignment._id}
                  />
                )}
                {selectedAnswers.map((answer) => (
                  <div key={answer.content}>
                    <AceEditor
                      mode="text"
                      theme="monokai"
                      value={answer.content}
                      setOptions={{
                        useWorker: false,
                        readOnly: true,
                      }}
                      style={{ width: "100%", height: "300px" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
