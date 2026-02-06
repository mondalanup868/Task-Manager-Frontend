import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask";
import Report from "./pages/Report";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-task"
          element={
            <ProtectedRoute>
              <AddTask />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
