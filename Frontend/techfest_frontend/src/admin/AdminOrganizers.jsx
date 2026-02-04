import React, { useState, useEffect } from 'react';
import { getAdminUsersByRole, approveUser } from '../../api/adminApi';
import './Admin.css';

const ROLE_ORGANISER = 2;

function AdminOrganizers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminUsersByRole(ROLE_ORGANISER)
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (uid) => {
    try {
      if (!window.confirm("Approve this organizer?")) return;
      await approveUser(uid);
      setUsers(prev => prev.map(u =>
        u.uid === uid ? { ...u, isApproved: true } : u
      ));
      alert("Organizer approved!");
    } catch (err) {
      alert("Failed to approve: " + err.message);
    }
  };

  if (loading) return <div className="admin-loading">Loading organizers…</div>;
  if (error) return <div className="admin-empty">Error: {error}</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Organizers</h1>
        <p className="admin-page-subtitle">
          Users registered as organizers (from user table). Verify and monitor organizer accounts.
        </p>
      </div>
      <div className="admin-card admin-table-wrap">
        {users.length === 0 ? (
          <p className="admin-empty">No organizers found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Phone</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid}>
                  <td>{u.name ?? '—'}</td>
                  <td>{u.email ?? '—'}</td>
                  <td>{u.username ?? '—'}</td>
                  <td>{u.phone ?? '—'}</td>
                  <td>{u.role?.rname ?? 'Organiser'}</td>
                  <td>
                    {u.isApproved ? (
                      <span className="badge bg-success">Approved</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pending</span>
                    )}
                  </td>
                  <td>
                    {!u.isApproved && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleApprove(u.uid)}
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default AdminOrganizers;
