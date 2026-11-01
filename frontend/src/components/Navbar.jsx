import { Bell, Search, ShoppingBasket, UserCircle } from "lucide-react";
import "./Navbar.css";

const Navbar = ({ onSearch, userName = "Reader" }) => {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">
          <ShoppingBasket size={25} />
        </div>
        <span>Book Basket</span>
      </div>

      <div className="navbar-search">
        <Search size={19} />
        <input
          type="text"
          placeholder="Search books, authors..."
          onChange={(e) => onSearch?.(e.target.value)}
        />
      </div>

      <div className="navbar-actions">
        <button className="navbar-icon" aria-label="Notifications">
          <Bell size={21} />
        </button>

        <div className="navbar-profile">
          <UserCircle size={28} />
          <span>{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;