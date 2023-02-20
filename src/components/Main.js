import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header/Header";
import "bootstrap/dist/css/bootstrap.css";

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/users")
      .then((res) => {
        setLoading(false);
        setUserData(res.data.users);
      })
      .catch((err) => {
        setLoading(false);
        setError(err);
      });
  }, []);

  return (
    <div className="container">
      <h1>Main Page</h1>
      <Header />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="alert alert-info">Loading...</div>}
      {userData && Array.isArray(userData) && (
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>email</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Main;
