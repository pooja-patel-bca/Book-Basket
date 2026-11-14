
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ExploreBooks from "./pages/ExploreBooks";
import BookDetails from "./pages/BookDetails";
import MyLibrary from "./pages/MyLibrary";
import Favourites from "./pages/Favourites";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public homepage */}
        <Route path="/" element={<Home />} />

        {/* Public authentication pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Protected pages */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<ExploreBooks />} />
          <Route path="/book/:id" element={<BookDetails />} />
          <Route path="/my-library" element={<MyLibrary />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Route>

        {/* Unknown pages */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
