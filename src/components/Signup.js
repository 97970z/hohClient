import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./header/Header";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isInputValid()) {
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        confirmPassword,
      });
      localStorage.setItem("token", res.data.token);
      setLoading(false);
      navigate("/main");
    } catch (err) {
      handleErrors(err);
      setLoading(false);
    }
  };

  const handleLink = () => {
    navigate("/login");
  };

  const isInputValid = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleErrors = (err) => {
    setError(err.response.data.msg);
  };

  return (
    <div className="container">
      <h1>Sign up</h1>
      <Header />
      {error && (
        <div className="alert alert-info" color="danger">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            className="form-control"
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            className="form-control"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="form-control"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleLink}
          disabled={loading}
          style={{ marginLeft: "10px" }}
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Signup;
