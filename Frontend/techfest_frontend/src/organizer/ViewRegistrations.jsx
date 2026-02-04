import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const API = "http://localhost:5041/organizer";

export default function ViewRegistrations() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventIdFromUrl = searchParams.get("eid");

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const ORGANIZER_ID = storedUser?.uid ?? null;

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventIdFromUrl || "");
  const [registrations, setRegistrations] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ORGANIZER_ID) {
      navigate("/login");
      return;
    }
    loadEvents();
  }, [ORGANIZER_ID, navigate]);

  useEffect(() => {
    if (selectedEventId) {
      loadRegistrations();
    } else {
      setRegistrations([]);
    }
  }, [selectedEventId]);

  const loadEvents = async () => {
    if (!ORGANIZER_ID) return;
    try {
      setLoadingEvents(true);
      setError("");
      const res = await axios.get(`${API}/dashboard/${ORGANIZER_ID}`);
      setEvents(res.data || []);
      
      // If eventId from URL exists, select it
      if (eventIdFromUrl) {
        const eventExists = res.data.some(e => e.eid === Number(eventIdFromUrl));
        if (eventExists) {
          setSelectedEventId(eventIdFromUrl);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadRegistrations = async () => {
    if (!selectedEventId) return;
    try {
      setLoadingRegs(true);
      const res = await axios.get(`${API}/registrations/${selectedEventId}`);
      setRegistrations(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load registrations.");
    } finally {
      setLoadingRegs(false);
    }
  };

  const selectedEvent = events.find(e => e.eid === Number(selectedEventId));

  if (!ORGANIZER_ID) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">
          Organizer details not found. Please log in as an organizer first.
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Organizer Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/organizer">
            TechFest Organizer
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/organizer">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/create-event">Create Event</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/manage-events">Manage Events</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/organizer/registrations">Registrations</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/analytics">Analytics</Link>
              </li>
            </ul>
            <button className="btn btn-outline-light btn-sm" onClick={() => { localStorage.removeItem("user"); navigate("/login"); }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0">View Event Registrations</h2>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate("/organizer")}
          >
            ← Back to Dashboard
          </button>
        </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Event Selection */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Select Event</h5>
        </div>
        <div className="card-body">
          {loadingEvents && <p className="text-muted">Loading events...</p>}

          {events.length === 0 && !loadingEvents && (
            <p className="text-muted mb-0">No events found. Create events to view registrations.</p>
          )}

          {events.length > 0 && (
            <div className="row">
              <div className="col-md-6">
                <label className="form-label fw-semibold">Choose an Event</label>
                <select
                  className="form-select"
                  value={selectedEventId}
                  onChange={e => setSelectedEventId(e.target.value)}
                >
                  <option value="">-- Select an event --</option>
                  {events.map(e => (
                    <option key={e.eid} value={e.eid}>
                      {e.ename} (ID: {e.eid}) - {e.date ? String(e.date).substring(0, 10) : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registrations Display */}
      {selectedEventId && (
        <div className="card shadow-sm">
          <div className="card-header bg-info text-white">
            <h5 className="mb-0">
              Registrations for: {selectedEvent?.ename || `Event ID ${selectedEventId}`}
            </h5>
          </div>
          <div className="card-body">
            {loadingRegs && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mt-2">Loading registrations...</p>
              </div>
            )}

            {!loadingRegs && registrations.length === 0 && (
              <div className="text-center py-4">
                <p className="text-muted mb-0">No registrations found for this event yet.</p>
              </div>
            )}

            {!loadingRegs && registrations.length > 0 && (
              <>
                {/* Summary Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="card border-primary">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-1">Total Registrations</h6>
                        <h3 className="mb-0 text-primary">{registrations.length}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="card border-info">
                      <div className="card-body text-center">
                        <h6 className="text-muted mb-1">Event Capacity</h6>
                        <h3 className="mb-0 text-info">{selectedEvent?.capacity || "N/A"}</h3>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registrations Table */}
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>Registration #</th>
                        <th>Attendee Name</th>
                        <th>Party Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map(r => (
                        <tr key={r.regId ?? r.reg_id}>
                          <td className="fw-semibold">{r.regId ?? r.reg_id}</td>
                          <td>{r.attendeeName ?? r.attendee_name ?? `Attendee #${r.attId ?? r.att_id}`}</td>
                          <td>
                            <span className="badge bg-primary">{r.noOfPeople ?? r.no_of_people}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {!selectedEventId && (
        <div className="alert alert-info">
          Please select an event from the dropdown above to view its registrations.
        </div>
      )}
      </div>
    </div>
  );
}
