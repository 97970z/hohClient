import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import EditInfo from "./components/Editinfo";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import MainPage from "./pages/MainPage";
import MyinfoPage from "./pages/MyinfoPage";
import AssignmentRegistrationPage from "./pages/AssignmentRegistrationPage";
import AssignmentAnswersPage from "./pages/AssignmentAnswersPage";

const App = () => {
  const tokenCheck = () => {
    const token = localStorage.getItem("token");
    return token !== null;
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/my-info" element={<MyinfoPage />} />
        <Route path="/edit-info" element={<EditInfo />} />
        <Route
          path="/assignment-registration"
          element={<AssignmentRegistrationPage />}
        />
        <Route path="/assignment-answers" element={<AssignmentAnswersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
