import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

const Home = () => {
  return (
    <div>
      <h1>Welcome to your React site!</h1>
      <p>Please log in or sign up to access your assignments.</p>
      <Link to="/login">Log in</Link>
      <br />
      <Link to="/register">Sign up</Link>
    </div>
  );
};

export default Home;
