import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EditInfoPage from "./components/Editinfo";
import LoginPage from "./components/Login";
import SignupPage from "./components/Signup";
import MainPage from "./components/Main";
import MyinfoPage from "./components/Myinfo";
import AssignmentRegistrationPage from "./components/AssignmentRegistration";
import AssignmentAnswersPage from "./components/AssignmentAnswers";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route
          path="/my-info"
          element={token ? <MyinfoPage /> : <LoginPage />}
        />
        <Route path="/edit-info" element={<EditInfoPage />} />
        <Route
          path="/assignment-registration"
          element={token ? <AssignmentRegistrationPage /> : <LoginPage />}
        />
        <Route path="/assignment-answers" element={<AssignmentAnswersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
