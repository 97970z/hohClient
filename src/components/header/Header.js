import React from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import AceEditor from "react-ace";
import "bootstrap/dist/css/bootstrap.css";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-text";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const buttons = isLoggedIn
    ? [
        {
          label: "질문하기",
          path: "/assignment-registration",
        },
        {
          label: "내 정보",
          path: "/my-info",
        },
        {
          label: "로그아웃",
          path: "/login",
          onClick: () => {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshtoken");
            localStorage.removeItem("accessTokenExp");
            localStorage.removeItem("refreshTokenExp");
          },
        },
      ]
    : [
        {
          label: "로그인",
          path: "/login",
        },
      ];

  return (
    <header style={{ marginBottom: "20px" }}>
      <Navbar expand="lg">
        <Navbar.Brand onClick={() => handleNavigation("/main")}>
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link onClick={() => handleNavigation("/assignment-answers")}>
              답변하기
            </Nav.Link>
            {buttons.map(({ label, path, onClick }) => (
              <Nav.Link
                key={label}
                onClick={() => {
                  handleNavigation(path);
                  if (onClick) onClick();
                }}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </header>
  );
};

export { Header, AceEditor, Helmet };
