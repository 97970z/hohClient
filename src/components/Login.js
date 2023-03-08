import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header/Header";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      setLoading(false);
      navigate("/main");
    } catch (err) {
      setLoading(false);
      setError(err.response.data.msg);
    }
  };

  const handleLink = () => {
    navigate("/register");
  };

  return (
    <div className="container">
      <h1>Login</h1>
      <Header />
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
        <button
          type="button"
          onClick={handleLink}
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
