import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const buttons = isLoggedIn
    ? [
        {
          label: "Assignment Registration",
          path: "/assignment-registration",
        },
        {
          label: "My Information",
          path: "/my-info",
        },
        {
          label: "Logout",
          path: "/login",
          onClick: () => localStorage.removeItem("token"),
        },
      ]
    : [
        {
          label: "Login",
          path: "/login",
        },
      ];

  return (
    <header style={{ marginBottom: "20px" }}>
      <nav>
        <ul className="nav nav-tabs nav-justified">
          <li>
            <button
              className="btn btn-default navbar-btn"
              onClick={() => handleNavigation("/main")}
            >
              Home
            </button>
          </li>
          <li>
            <button
              className="btn btn-default navbar-btn"
              onClick={() => handleNavigation("/chatbot")}
            >
              ChatGPT bot
            </button>
          </li>
          <li>
            <button
              className="btn btn-default navbar-btn"
              onClick={() => handleNavigation("/assignment-answers")}
            >
              Assignment Answers
            </button>
          </li>
          {buttons.map(({ label, path, onClick }) => (
            <li key={label}>
              <button
                className="btn btn-default navbar-btn"
                onClick={() => {
                  handleNavigation(path);
                  if (onClick) onClick();
                }}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
