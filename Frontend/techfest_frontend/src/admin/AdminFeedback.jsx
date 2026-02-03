import React, { useState, useEffect } from 'react';
import { getAdminFeedback } from '../../api/adminApi';
import './Admin.css';

function AdminFeedback() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminFeedback()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-loading">Loading feedback…</div>;
  if (error) return <div className="admin-empty">Error: {error}</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Attendee Feedback</h1>
        <p className="admin-page-subtitle">Feedback given by attendees for events.</p>
      </div>
      <div className="admin-card admin-table-wrap">
        {list.length === 0 ? (
          <p className="admin-empty">No feedback yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Attendee</th>
                <th>Rating</th>
                <th>Remark</th>
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.fid}>
                  <td>
                    {f.event?.ename ?? `Event #${f.event?.eid ?? '—'}`}
                  </td>
                  <td>
                    {f.attendee?.user?.name ?? f.attendee?.user?.email ?? `Attendee #${f.attendee?.att_id ?? '—'}`}
                  </td>
                  <td>
                    <span className="feedback-rating">
                      {f.rating ?? '—'} / 5
                    </span>
                  </td>
                  <td>{f.remark ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default AdminFeedback;
