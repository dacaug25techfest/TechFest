import React, { useState, useEffect } from 'react';
import {
  getAdminEvents,
  getAdminPendingEvents,
  getAdminFeedback,
  getAdminUsers,
} from '../api/adminApi';
import './Admin.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    events: 0,
    pending: 0,
    feedback: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [events, pending, feedback, users] = await Promise.all([
          getAdminEvents(),
          getAdminPendingEvents(),
          getAdminFeedback(),
          getAdminUsers(),
        ]);
        if (!cancelled) {
          setStats({
            events: events?.length ?? 0,
            pending: pending?.length ?? 0,
            feedback: feedback?.length ?? 0,
            users: users?.length ?? 0,
          });
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard…</div>;
  if (error) return <div className="admin-empty">Error: {error}</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Dashboard</h1>
        <p className="admin-page-subtitle">Platform activity overview</p>
      </div>
      <div className="admin-stats">
        <div className="admin-stat-card">
          <p className="admin-stat-value">{stats.events}</p>
          <p className="admin-stat-label">Total Events</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-value">{stats.pending}</p>
          <p className="admin-stat-label">Pending Approval</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-value">{stats.users}</p>
          <p className="admin-stat-label">Registered Users</p>
        </div>
        <div className="admin-stat-card">
          <p className="admin-stat-value">{stats.feedback}</p>
          <p className="admin-stat-label">Feedback Entries</p>
        </div>
      </div>
      <div className="admin-card">
        <h2 className="admin-card-title">Quick actions</h2>
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>
          Use the sidebar to view all events, approve or reject pending events,
          verify organizers, and read attendee feedback.
        </p>
      </div>
    </>
  );
}

export default AdminDashboard;
