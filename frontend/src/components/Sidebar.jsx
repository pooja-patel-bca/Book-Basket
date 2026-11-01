import {
  LayoutDashboard,
  Compass,
  Library,
  Heart,
  UserRound,
  LogOut,
} from "lucide-react";

import "./Sidebar.css";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/" },
  { label: "Explore Books", icon: Compass, path: "/explore" },
  { label: "My Library", icon: Library, path: "/my-library" },
  { label: "Favourites", icon: Heart, path: "/favourites" },
  { label: "My Profile", icon: UserRound, path: "/profile" },
];

const Sidebar = ({ activePath = "/", onNavigate, onLogout }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-heading">
        <span>YOUR SPACE</span>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            activePath === item.path ||
            (item.path !== "/" && activePath.startsWith(item.path));

          return (
            <button
              key={item.path}
              className={`sidebar-link ${active ? "active" : ""}`}
              onClick={() => onNavigate?.(item.path)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button className="sidebar-link logout-link" onClick={onLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;