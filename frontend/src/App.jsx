import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Posts from "./pages/Posts";

const isAuthenticated = () => {
  return localStorage.getItem("token");
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/posts"
        element={
          isAuthenticated() ? <Posts /> : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
