import React, { ReactElement } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import "./App.css";
import { useSelector } from 'react-redux';
import type { RootState } from './store';

function ProtectedRoute({ children }: { children: ReactElement }) {
  const isAuthenticated = useSelector((state: RootState) => state.isAuthenticated);
  console.log('isAuthenticated:', isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
