import React, { useState } from "react";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

const AnswerForm = ({ assignmentId }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    };
    const data = {
      answer,
      assignment: assignmentId,
    };
    try {
      const res = await axios.post("/api/assignment-answers", data, config);
      console.log(res.data);
    } catch (err) {
      console.error(err.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AceEditor
        mode="javascript"
        theme="monokai"
        value={answer}
        onChange={(value) => setAnswer(value)}
        setOptions={{
          useWorker: false,
        }}
        style={{ width: "100%", height: "500px" }}
      />
      <button className="btn btn-primary mt-2">Register</button>
    </form>
  );
};

export default AnswerForm;
