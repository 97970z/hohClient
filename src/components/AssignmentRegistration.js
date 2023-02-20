import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import Header from "./header/Header";
import "bootstrap/dist/css/bootstrap.css";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-github";

const AssignmentRegistration = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [expiration, setExpiration] = useState("");
  const [content, setContent] = useState("");
  const [points, setPoints] = useState("");
  const [user, setUser] = useState({});
  const [language, setLanguage] = useState("javascript");

  let date = new Date();
  let offset = date.getTimezoneOffset() * 60000;
  let dateOffset = new Date(date.getTime() - offset);
  let dateOffsetString = dateOffset.toISOString().split("T")[0];

  useEffect(() => {
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
        setAuthor(res.data.name);
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let newGenre = genre;
      if (genre === "coding") {
        switch (language) {
          case "javascript":
            newGenre = "js";
            break;
          case "python":
            newGenre = "py";
            break;
          case "c_cpp":
            newGenre = "c";
            break;
          case "java":
            newGenre = "java";
            break;
          default:
            newGenre = "coding";
            break;
        }
      }

      const newAssignment = {
        title,
        author: user._id,
        genre: newGenre,
        expiration,
        createdAt: new Date(),
        content,
        points,
      };
      const res = await axios.post("/api/assignments", newAssignment);
      navigate("/main");
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="container">
      <h1>Assignment Registration</h1>
      <Header />
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            placeholder="제목을 입력하세요."
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
          <input
            type="text"
            className="form-control"
            id="author"
            value={author}
            disabled
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Genre</label>
          <select
            className="form-control"
            id="genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          >
            <option value="">질문 종류를 선택하세요.</option>
            <option value="coding">Coding</option>
            <option value="writing">Writing</option>
            <option value="math">Math</option>
          </select>
          {genre === "coding" && (
            <div className="form-group">
              <label htmlFor="language">Programming Language</label>
              <select
                className="form-control"
                id="language"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="">Select a language</option>
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="c_cpp">C/C++</option>
                <option value="java">Java</option>
              </select>
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="expiration">Expiration Date</label>
          <input
            type="date"
            className="form-control"
            id="expiration"
            value={expiration}
            min={dateOffsetString}
            onChange={(e) => setExpiration(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <AceEditor
            mode={language}
            theme={genre === "coding" ? "monokai" : "github"}
            name="content"
            setOptions={{
              useWorker: false,
            }}
            editorProps={{ $blockScrolling: true }}
            style={{ width: "100%", height: "500px" }}
            value={content}
            onChange={(value) => setContent(value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="points">Points</label>
          <input
            type="number"
            className="form-control"
            id="points"
            minLength="1"
            maxLength="5"
            placeholder="해결포인트를 입력하세요. (1~5)"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mr-2">
          Create
        </button>
      </form>
    </div>
  );
};

export default AssignmentRegistration;
