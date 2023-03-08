import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./header/Header";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const EditInfo = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const user = location.state.user;

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `${token}`,
          },
        };
        const res = await axios.get("/api/auth/me", config);
        setUsername(res.data.name);
      } catch (err) {
        console.error(err);
      }
    };

    getUserInfo();
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError("");
    setIsUsernameValid(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevValue) => !prevValue);
  };

  const handleDuplicateCheck = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get(`/api/users/duplicate-check/${username}`);
      setIsUsernameValid(res.data.message === "Username is available");
      setError(res.data.message);
    } catch (err) {
      console.error("err:", err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };

      const data = { name: username };
      if (password) {
        data.password = password;
      }
      const res = await axios.put(`/api/users/${user._id}`, data, config);
      console.log(res.data);
      navigate("/my-info");
    } catch (err) {
      console.error(err.response.data);
      setError(err.response.data);
    }
  };

  return (
    <div className="container">
      <h1>Edit User Information</h1>
      <Header />
      <form onSubmit={handleEditSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              required
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="duplicate-check-btn"
              onClick={handleDuplicateCheck}
            >
              Check
            </button>
          </div>
          {error && <div className="alert alert-info">{error}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="password">New Password</label>
          <div className="input-group">
            <input
              type={isPasswordVisible ? "text" : "password"}
              className="form-control"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={togglePasswordVisibility}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!isUsernameValid}
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditInfo;
