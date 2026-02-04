import React, { useState, useEffect, useMemo } from 'react';
import { getAdminFeedback } from '../../api/adminApi';
import './Admin.css';

function StarRating({ rating, maxStars = 5 }) {
  const r = Math.min(maxStars, Math.max(0, Number(rating) || 0));
  const full = Math.floor(r);
  const half = r - full >= 0.5;
  const empty = maxStars - full - (half ? 1 : 0);
  return (
    <span className="feedback-stars" title={`${r.toFixed(1)} / ${maxStars}`}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(empty)}
    </span>
  );
}

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

  const eventSummary = useMemo(() => {
    const byEvent = {};
    list.forEach((f) => {
      const eid = f.event?.eid ?? f.event?.eventId;
      const key = eid ?? 'unknown';
      if (!byEvent[key]) {
        byEvent[key] = {
          eventName: f.event?.ename ?? `Event #${eid ?? '—'}`,
          ratings: [],
          remarks: [],
        };
      }
      if (f.rating != null) byEvent[key].ratings.push(Number(f.rating));
      if (f.remark) byEvent[key].remarks.push(f.remark);
    });
    return Object.entries(byEvent).map(([eid, data]) => ({
      eventId: eid,
      eventName: data.eventName,
      avgRating: data.ratings.length
        ? (data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length).toFixed(1)
        : null,
      count: data.ratings.length,
      remarks: data.remarks,
    }));
  }, [list]);

  if (loading) return <div className="admin-loading">Loading feedback…</div>;
  if (error) return <div className="admin-empty">Error: {error}</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">Event Feedback Summary</h1>
        <p className="admin-page-subtitle">Average feedback rating per event (5-star scale).</p>
      </div>
      <div className="admin-card admin-table-wrap">
        {eventSummary.length === 0 ? (
          <p className="admin-empty">No feedback yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Average Rating</th>
                <th>Responses</th>
                <th>Sample Remarks</th>
              </tr>
            </thead>
            <tbody>
              {eventSummary.map((row) => (
                <tr key={row.eventId}>
                  <td>{row.eventName}</td>
                  <td>
                    {row.avgRating != null ? (
                      <StarRating rating={row.avgRating} />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>{row.count}</td>
                  <td>
                    {row.remarks.slice(0, 2).join(' • ') || '—'}
                    {row.remarks.length > 2 && ` (+${row.remarks.length - 2} more)`}
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

export default AdminFeedback;
