import React, { useState, useEffect } from "react";
import axios from "axios";
import { Header } from "./header/Header";
import { Container, Table, Alert, Spinner } from "react-bootstrap";

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

  const sortedUserData = userData
    ? [...userData].sort((a, b) => b.points - a.points)
    : null;

  return (
    <Container>
      <h1 className="mt-3">Main Page</h1>
      <Header />
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {sortedUserData && Array.isArray(sortedUserData) && (
        <Table striped bordered hover responsive className="mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedUserData.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.points}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Main;
