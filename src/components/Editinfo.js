import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./header/Header";

const EditInfo = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(false);
  const location = useLocation();
  const user = location.state.user;

  useEffect(() => {
    const getUserInfo = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `${token}`,
        },
      };
      try {
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

  const handleDuplicateCheck = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.get(`/api/users/duplicate-check/${username}`);
      if (res.data.message !== "Username is available") {
        setIsUsernameValid(false);
      } else {
        setIsUsernameValid(true);
      }
      setError(res.data.message);
    } catch (err) {
      console.error("err:", err.message);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    try {
      const data = { name: username };
      const res = await axios.put(`/api/users/${user._id}`, data, config);
      console.log(res.data);
      window.location.href = "/my-info";
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
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isUsernameValid}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditInfo;
