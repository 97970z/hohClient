import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const headerStyle = {
  marginBottom: "20px",
};

const Header = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/main");
  };

  const handleAssignmentRegistrationClick = () => {
    navigate("/assignment-registration");
  };

  const handleAssignmentAnswerClick = () => {
    navigate("/assignment-answers");
  };

  const handleMyInformationClick = () => {
    navigate("/my-info");
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header style={headerStyle}>
      <nav>
        <div>
          <ul className="nav nav-tabs nav-justified">
            <li>
              <button
                className="btn btn-default navbar-btn"
                onClick={handleHomeClick}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className="btn btn-default navbar-btn"
                onClick={handleAssignmentRegistrationClick}
              >
                Assignment Registration
              </button>
            </li>
            <li>
              <button
                className="btn btn-default navbar-btn"
                onClick={handleAssignmentAnswerClick}
              >
                Assignment Answers
              </button>
            </li>
            <li>
              <button
                className="btn btn-default navbar-btn"
                onClick={handleMyInformationClick}
              >
                My Information
              </button>
            </li>
            <li>
              <button
                className="btn btn-default navbar-btn"
                onClick={handleLogoutClick}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
