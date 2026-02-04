import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getAdminEvents,
  getAdminPendingEvents,
  approveEvent,
  rejectEvent,
} from '../../api/adminApi';
import './Admin.css';

function formatTime(t) {
  if (!t) return '—';
  if (typeof t === 'string') return t.slice(0, 5);
  return String(t).slice(0, 5);
}

function formatDate(d) {
  if (!d) return '—';
  if (typeof d === 'string') return d.slice(0, 10);
  return String(d).slice(0, 10);
}

const STATUS_LABELS = { 0: 'PENDING', 1: 'APPROVED', 2: 'REJECTED' };
function statusLabel(s) {
  if (s == null) return '—';
  return STATUS_LABELS[s] ?? String(s);
}

function AdminEvents() {
  const location = useLocation();
  const isPendingOnly = location.pathname.endsWith('/pending');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionId, setActionId] = useState(null);
  const [rejectModal, setRejectModal] = useState({ open: false, id: null, reason: '' });

  const fetchEvents = () => {
    setLoading(true);
    setError(null);
    const fn = isPendingOnly ? getAdminPendingEvents : getAdminEvents;
    fn()
      .then(setEvents)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, [isPendingOnly]);

  const handleApprove = async (id) => {
    setActionId(id);
    try {
      await approveEvent(id);
      fetchEvents();
    } catch (e) {
      setError(e.message);
    } finally {
      setActionId(null);
    }
  };

  const openReject = (id) => setRejectModal({ open: true, id, reason: '' });
  const closeReject = () => setRejectModal({ open: false, id: null, reason: '' });

  const handleReject = async () => {
    if (!rejectModal.id) return;
    setActionId(rejectModal.id);
    try {
      await rejectEvent(rejectModal.id, rejectModal.reason || 'Not specified');
      closeReject();
      fetchEvents();
    } catch (e) {
      setError(e.message);
    } finally {
      setActionId(null);
    }
  };

  if (loading) return <div className="admin-loading">Loading events…</div>;
  if (error) return <div className="admin-empty">Error: {error}</div>;

  return (
    <>
      <div className="admin-page-header">
        <h1 className="admin-page-title">
          {isPendingOnly ? 'Pending Events' : 'All Events'}
        </h1>
        <p className="admin-page-subtitle">
          {isPendingOnly
            ? 'Approve or reject events created by organizers.'
            : 'All events on the platform.'}
        </p>
      </div>
      <div className="admin-card admin-table-wrap">
        {events.length === 0 ? (
          <p className="admin-empty">No events found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Fee</th>
                <th>Status</th>
                {isPendingOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev.eid}>
                  <td>
                    <strong>{ev.ename}</strong>
                    {ev.description && (
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: 2 }}>
                        {ev.description.slice(0, 60)}
                        {ev.description.length > 60 ? '…' : ''}
                      </div>
                    )}
                  </td>
                  <td>{formatDate(ev.date)}</td>
                  <td>{formatTime(ev.time)}</td>
                  <td>₹{ev.fair ?? 0}</td>
                  <td>
                    <span className={`status-${(STATUS_LABELS[ev.status] ?? '').toLowerCase()}`}>
                      {statusLabel(ev.status)}
                    </span>
                  </td>
                  {isPendingOnly && (
                    <td>
                      <button
                        type="button"
                        className="admin-btn admin-btn-approve"
                        disabled={actionId !== null}
                        onClick={() => handleApprove(ev.eid)}
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-reject"
                        disabled={actionId !== null}
                        onClick={() => openReject(ev.eid)}
                      >
                        Reject
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {rejectModal.open && (
        <div className="admin-modal-overlay" onClick={closeReject}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Reject event</h3>
            <textarea
              placeholder="Reason for rejection (optional)"
              value={rejectModal.reason}
              onChange={(e) =>
                setRejectModal((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn" onClick={closeReject}>
                Cancel
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-reject"
                onClick={handleReject}
                disabled={actionId !== null}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminEvents;
