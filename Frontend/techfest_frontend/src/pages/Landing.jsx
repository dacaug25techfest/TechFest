import { Link } from 'react-router-dom';
import './Landing.css';

function Landing() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      {/* Header / Navbar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">TechFest</div>
          <nav className="nav-links">
            <button onClick={() => scrollToSection('home')} className="nav-link">Home</button>
            <button onClick={() => scrollToSection('features')} className="nav-link">Features</button>
            <button onClick={() => scrollToSection('roles')} className="nav-link">Roles</button>

          </nav>
          <div className="nav-actions">
            <Link to="/login" className="btn-outline">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="container">
          <h1 className="hero-title">Discover & Register for Technical Events</h1>
          <p className="hero-subtitle">
            A centralized platform that brings together technical events, making discovery and registration simple and organized.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-primary btn-large">Get Started</Link>
            <Link to="/login" className="btn-outline btn-large">Sign In</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-title">Why TechFest?</h2>
          <p className="section-subtitle">
            Everything you need to discover and participate in technical events, all in one place.
          </p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3 className="feature-title">Centralized Discovery</h3>
              <p className="feature-description">
                Find all technical events in one place. No more scattered information across multiple platforms.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3 className="feature-title">Easy Registration</h3>
              <p className="feature-description">
                Register for events with just a few clicks. Simple, fast, and hassle-free process.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Role-Based Access</h3>
              <p className="feature-description">
                Tailored experience for Attendees, Organizers, and Admins with appropriate permissions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3 className="feature-title">Organized Information</h3>
              <p className="feature-description">
                Well-structured event details, schedules, and requirements at your fingertips.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="roles">
        <div className="container">
          <h2 className="section-title">For Everyone</h2>
          <p className="section-subtitle">
            TechFest serves different user roles with tailored features and capabilities.
          </p>
          <div className="roles-grid">
            <div className="role-card">
              <h3 className="role-title">Attendees</h3>
              <p className="role-description">
                Discover events, register easily, and manage your participation. Track your registered events and stay updated.
              </p>
            </div>
            <div className="role-card">
              <h3 className="role-title">Organizers</h3>
              <p className="role-description">
                Create and manage your technical events. Handle registrations, communicate with attendees, and track participation.
              </p>
            </div>
            <div className="role-card">
              <h3 className="role-title">Admins</h3>
              <p className="role-description">
                Oversee the platform, manage users and events, ensure quality, and maintain the ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">© 2026 TechFest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;

