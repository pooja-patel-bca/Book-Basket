import { Heart, ShoppingBasket } from "lucide-react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <ShoppingBasket size={19} />
        <span>Book Basket</span>
      </div>

      <p className="footer-tagline">
        Stories worth collecting.
      </p>

      <div className="footer-copyright">
        Made with <Heart size={14} /> for book lovers
        <span>© {new Date().getFullYear()} Book Basket</span>
      </div>
    </footer>
  );
};

export default Footer;