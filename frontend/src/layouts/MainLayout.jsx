import { Outlet, useLocation, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

import "./MainLayout.css";

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const user = getUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="main-layout">
      <Navbar userName={user.name || "Reader"} />

      <div className="main-layout-body">
        <Sidebar
          activePath={location.pathname}
          onNavigate={navigate}
          onLogout={handleLogout}
        />

        <main className="main-content">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default MainLayout;