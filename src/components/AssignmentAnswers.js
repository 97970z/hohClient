import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header/Header";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "bootstrap/dist/css/bootstrap.css";

const AssignmentAnswers = () => {
  const [assignments, setAssignments] = useState([]);
  const [numAssignments, setNumAssignments] = useState(5);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);

  useEffect(() => {
    const getAssignments = async () => {
      const res = await axios.get("/api/assignments");
      setAssignments(res.data);
    };

    getAssignments();
  }, []);

  const handleExpandClick = (id) => {
    if (id === expandedAssignmentId) {
      setExpandedAssignmentId(null);
    } else {
      setExpandedAssignmentId(id);
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
  const sortedAssignments = assignments.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="container">
      <h1>Assignment Answers</h1>
      <Header />
      {sortedAssignments.slice(0, numAssignments).map((assignment) => (
        <div key={assignment._id} className="card mb-3">
          <div className="card-body">
            <h5
              className="card-title"
              onClick={() => handleExpandClick(assignment._id)}
            >
              {assignment.genre} / {assignment.title}
            </h5>

            <h6 className="card-subtitle mb-2 text-muted">
              {assignment.author}
            </h6>
            {expandedAssignmentId === assignment._id && (
              <div className="card-text">
                <AceEditor
                  mode="javascript"
                  theme="monokai"
                  value={assignment.content}
                  setOptions={{
                    useWorker: false,
                    readOnly: true,
                  }}
                  style={{ width: "100%", height: "400px" }}
                />
              </div>
            )}
            <p className="card-text">Points: {assignment.points}</p>
            <p className="card-text">
              Expiration: {handleExpired(assignment.expiration)}
            </p>
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
