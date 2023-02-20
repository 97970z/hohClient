import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./header/Header";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";

const MyInfo = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    axios
      .get("/api/auth/me", config)
      .then((res) => {
        setLoading(false);
        setUser(res.data);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
        console.error(err);
      });
  }, []);

  return (
    <div className="container">
      <h1>My Info</h1>
      <Header />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}
      {user && (
        <div>
          <p>
            <strong>Username:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate("/edit-info", { state: { user } });
            }}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default MyInfo;
