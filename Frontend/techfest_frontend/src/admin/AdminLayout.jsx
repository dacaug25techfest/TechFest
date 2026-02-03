import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import './Admin.css';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`;

  return (
    <div className="admin-app">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <Link to="/admin/dashboard" className="admin-logo">TechFest Admin</Link>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin/dashboard" className={navLinkClass}>Dashboard</NavLink>
          <NavLink to="/admin/events" end className={navLinkClass}>All Events</NavLink>
          <NavLink to="/admin/events/pending" className={navLinkClass}>Pending Events</NavLink>
          <NavLink to="/admin/organizers" className={navLinkClass}>Organizers</NavLink>
          <NavLink to="/admin/feedback" className={navLinkClass}>Feedback</NavLink>
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-nav-link">View site</Link>
          <button type="button" className="admin-logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
