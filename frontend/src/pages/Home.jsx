
import { Link } from "react-router-dom";
import BlurText from "../components/BlurText";
import "./Home.css";

const Home = () => {
    return (
        <main className="home-page">

            {/* Background Video */}
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

                <p className="home-eyebrow">
                    A WORLD OF STORIES AWAITS
                </p>

                <div className="home-heading" role="heading" aria-level="1">

                    <BlurText
                        text="Discover Your"
                        delay={150}
                        animateBy="words"
                        direction="top"
                        stepDuration={0.4}
                        blur={8}
                        distance={35}
                        effect="blur"
                        trigger="load"
                        className="home-blur-text"
                    />

                    <div className="home-favourite-text">
                        <BlurText
                            text="Next Favourite Book."
                            delay={150}
                            animateBy="words"
                            direction="top"
                            stepDuration={0.4}
                            blur={8}
                            distance={35}
                            effect="blur"
                            trigger="load"
                            className="home-blur-text"
                        />
                    </div>

                </div>

                <p className="home-description">
                    Explore stories, discover new knowledge, and build
                    your personal library. Your next favourite book is
                    just a discovery away.
                </p>

                <Link to="/explore" className="home-cta">
                    EXPLORE BOOKS
                    <span>→</span>
                </Link>

                <p className="home-note">
                    DISCOVER · READ · COLLECT
                </p>

            </section>

            {/* Footer */}
            <footer className="home-footer">
                <p>© 2026 Book Basket. A place for every story.</p>
            </footer>

        </main>
    );
};

export default Home;
