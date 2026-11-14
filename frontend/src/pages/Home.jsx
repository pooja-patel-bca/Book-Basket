
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    return (
        <main className="home-page">
            {/* Library Background */}
            <video
                className="home-background"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/library-video.mp4" type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div className="home-overlay"></div>

            {/* Navigation */}
            <header className="home-navbar">
                <Link to="/" className="home-logo">
                    <span className="logo-icon">B</span>
                    <span>Book Basket</span>
                </Link>

                <nav>
                    <Link to="/login" className="nav-login">
                        Login
                    </Link>
                    <Link to="/register" className="nav-register">
                        Get Started
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="home-hero">
                <p className="home-eyebrow">A WORLD OF STORIES AWAITS</p>

                <h1>
                    Discover Your
                    <br />
                    Next <span>Favourite Book.</span>
                </h1>

                <p className="home-description">
                    Explore stories, discover new knowledge, and build
                    your personal library. Your next favourite book is
                    just a discovery away.
                </p>

                <Link to="/explore" className="home-cta">
                    EXPLORE BOOKS
                    <span>→</span>
                </Link>

                <p className="home-note">DISCOVER · READ · COLLECT</p>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>© 2026 Book Basket. A place for every story.</p>
            </footer>
        </main>
    );
};

export default Home;
