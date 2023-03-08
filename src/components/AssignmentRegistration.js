import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import Header from "./header/Header";
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
  const [language, setLanguage] = useState("javascript");

  let date = new Date();
  let offset = date.getTimezoneOffset() * 60000;
  let dateOffset = new Date(date.getTime() - offset);
  let dateOffsetString = dateOffset.toISOString().split("T")[0];

  useEffect(() => {
    const fetchAuthor = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      };
      try {
        const { data } = await axios.get(`/api/auth/me`, config);
        setAuthor(data._id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAuthor();
  }, []);

  const getFileExtension = (language) => {
    switch (language) {
      case "javascript":
        return "js";
      case "python":
        return "py";
      case "c_cpp":
        return "c";
      case "java":
        return "java";
      default:
        return "coding";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let newGenre = genre;
      if (genre === "coding") {
        newGenre = getFileExtension(language);
      }

      const newAssignment = {
        title,
        author,
        genre: newGenre,
        expiration,
        createdAt: new Date(),
        content,
        points,
      };
      await axios.post("/api/assignments", newAssignment);
      navigate("/assignment-answers");
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
            name="title"
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
