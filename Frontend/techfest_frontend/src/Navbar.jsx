import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const user = (() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

  const isOrganizer = user?.role?.rname === "Organizer" || user?.role?.rid === 2 || location.pathname.startsWith("/organizer");
  const isAttendee = user?.role?.rname === "Attendee" || user?.role?.rid === 1 || location.pathname.startsWith("/attendee");
  const isAdmin = user?.role?.rname === "Admin" || user?.role?.rid === 3 || location.pathname.startsWith("/admin");

  // Hide global navbar for pages that have their own navbar
  if (location.pathname.startsWith("/organizer") || 
      location.pathname.startsWith("/attendee/profile") ||
      location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand fw-bold" to="/">
        TechFest
      </Link>

      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto">
          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">
                  Register
                </Link>
              </li>
            </>
          )}

          {isAttendee && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/attendee/events">
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/attendee/tickets">
                  My Tickets
                </Link>
              </li>
            </>
          )}

          {isOrganizer && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer">
                  Organizer Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/create-event">
                  Create Event
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/manage-events">
                  Delete / Manage Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/registrations">
                  View Registrations
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/analytics">
                  Analytics
                </Link>
              </li>
            </>
          )}

          {isAdmin && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Admin Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/admin/approve-events">
                  Approve Events
                </Link>
              </li>
            </>
          )}
        </ul>

        {user && (
          <span className="navbar-text me-3">
            Signed in as <strong>{user.username || user.name || user.email}</strong>
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;