import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/dashboard/Dashboard";
import AddDocumentForm from "./components/forms/AddDocumentForm";
import Header from "./components/homepage/Header";
import Home from "./components/homepage/Home";
import GameHome from "./components/landingpage/GameHome";
import ForgotPassword from "./components/login/ForgotPassword";
import Login from "./components/login/Login";
import ResetPassword from "./components/login/ResetPassword";
import SignUp from "./components/signup/SignUp";
import AllFiles from "./components/viewer/AllFiles";
import Open from "./components/viewer/Open";

import { AuthProvider } from "./components/context/AuthContext";
import ProtectedRoute from "./components/context/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
          <Route path="/open" element={<Open />} />

          <Route path="/gamehome" element={<GameHome />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role={['admin']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adddocumentform"
            element={
              <ProtectedRoute role={['admin']}>
                <AddDocumentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/allfiles"
            element={
              <ProtectedRoute>
                <AllFiles />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
