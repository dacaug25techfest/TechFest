import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:8080/organizer";

// Lookup helpers - handle both camelCase and PascalCase
const getVenue = (vid, venues) =>
  venues.find(v => (v.vid ?? v.Vid) === Number(vid));

const getStateId = s => s?.stateId ?? s?.StateId ?? s?.state_id;
const getStateLabel = s => s?.sname ?? s?.Sname ?? s?.stateName ?? "";

const getCityId = c => c?.cityId ?? c?.CityId ?? c?.city_id;
const getCityStateId = c => c?.sid ?? c?.StateId ?? c?.stateId ?? c?.state_id;
const getCityLabel = c => c?.cname ?? c?.Cname ?? c?.cityName ?? "";

const getVenueStateId = v => v?.sid ?? v?.StateId ?? v?.stateId ?? v?.state_id;
const getVenueCityId = v => v?.cid ?? v?.CityId ?? v?.cityId ?? v?.city_id;

const getStateName = (stateId, states) => {
  const s = states.find(st => getStateId(st) === Number(stateId));
  return s ? getStateLabel(s) : stateId ?? "-";
};

const getCityName = (cityId, cities) => {
  const c = cities.find(ct => getCityId(ct) === Number(cityId));
  return c ? getCityLabel(c) : cityId ?? "-";
};

const STATUS_LABELS = { 0: 'PENDING', 1: 'APPROVED', 2: 'REJECTED' };
const getStatusLabel = (status) => {
  if (status == null) return 'PENDING';
  return STATUS_LABELS[status] ?? String(status);
};
const getStatusBadgeClass = (status) => {
  if (status == null || status === 0) return 'bg-warning';
  if (status === 1) return 'bg-success';
  if (status === 2) return 'bg-danger';
  return 'bg-secondary';
};

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const ORGANIZER_ID = storedUser?.uid ?? null;

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [error, setError] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [venues, setVenues] = useState([]);

  const [analytics, setAnalytics] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  const [selectedEventId, setSelectedEventId] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loadingRegs, setLoadingRegs] = useState(false);

  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  const analyticsStats = useMemo(() => {
    const totalRegs = analytics.reduce((sum, ev) => sum + (ev.totalRegistrations || ev.total_registrations || 0), 0);
    return { totalRegs, eventCount: analytics.length };
  }, [analytics]);

  useEffect(() => {
    loadLookups();
  }, []);

  useEffect(() => {
    if (ORGANIZER_ID) {
      loadEvents();
      loadAnalytics();
    }
  }, [ORGANIZER_ID]);

  const loadEvents = async () => {
    if (!ORGANIZER_ID) return;
    try {
      setLoadingEvents(true);
      setError("");
      const res = await axios.get(`${API}/dashboard/${ORGANIZER_ID}`);
      setEvents(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load events. Please try again.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadAnalytics = async () => {
    if (!ORGANIZER_ID) return;
    try {
      setLoadingAnalytics(true);
      const res = await axios.get(`${API}/analytics/${ORGANIZER_ID}`);
      setAnalytics(res.data || []);
    } catch (err) {
      console.error("Failed to load analytics", err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [statesRes, citiesRes, venuesRes] = await Promise.all([
        axios.get(`${API}/states`),
        axios.get(`${API}/cities`),
        axios.get(`${API}/venues`),
      ]);
      
      console.log("States API Response:", statesRes.data);
      console.log("Cities API Response:", citiesRes.data);
      console.log("Venues API Response:", venuesRes.data);
      
      const statesData = statesRes.data || [];
      const citiesData = citiesRes.data || [];
      const venuesData = venuesRes.data || [];
      
      console.log(`Loaded ${statesData.length} states, ${citiesData.length} cities, ${venuesData.length} venues`);
      
      if (statesData.length > 0) {
        console.log("First state sample:", statesData[0]);
      }
      
      setStates(statesData);
      setCities(citiesData);
      setVenues(venuesData);
    } catch (err) {
      console.error("Failed to load lookup data", err);
      console.error("Error details:", err.response?.data || err.message);
      setError(`Failed to load location data: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteEvent = async eid => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`${API}/event/${eid}`);
      setEvents(prev => prev.filter(e => e.eid !== eid));
      if (selectedEventId === eid) {
        setSelectedEventId(null);
        setRegistrations([]);
      }
      loadAnalytics();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event. Please try again.");
    }
  };

  const viewRegistrations = async eid => {
    setSelectedEventId(eid);
    setRegistrations([]);

    try {
      setLoadingRegs(true);
      const res = await axios.get(`${API}/registrations/${eid}`);
      setRegistrations(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load registrations.");
    } finally {
      setLoadingRegs(false);
    }
  };

  const sendAnnouncement = async () => {
    if (!selectedEventId) {
      alert("Please select an event first.");
      return;
    }
    if (!announcementMessage.trim()) {
      alert("Please enter an announcement message.");
      return;
    }

    try {
      setSendingAnnouncement(true);
      await axios.post(`${API}/announcement`, {
        eventId: selectedEventId,
        message: announcementMessage,
      });
      alert("Announcement sent successfully");
      setAnnouncementMessage("");
    } catch (err) {
      console.error(err);
      alert("Failed to send announcement.");
    } finally {
      setSendingAnnouncement(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  if (!ORGANIZER_ID) {
    return (
      <div className="min-vh-100 bg-light">
        <div className="container py-5">
          <div className="alert alert-warning">
            Organizer details not found. Please log in as an organizer first.
          </div>
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
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link active" to="/organizer">
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/create-event">
                  Create Event
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/manage-events">
                  Manage Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/registrations">
                  Registrations
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/analytics">
                  Analytics
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <span className="text-white me-3">
                {storedUser?.name || storedUser?.username || `ID: ${ORGANIZER_ID}`}
              </span>
              <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-4">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 fw-bold mb-1">Organizer Dashboard</h1>
            <p className="text-muted mb-0">Manage your events, view registrations, and track analytics</p>
          </div>
          <div>
            <button className="btn btn-primary me-2" onClick={() => navigate("/organizer/create-event")}>
              <i className="bi bi-plus-circle me-1"></i>Create Event
            </button>
            <button className="btn btn-outline-primary" onClick={() => navigate("/organizer/manage-events")}>
              <i className="bi bi-gear me-1"></i>Manage Events
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError("")}></button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-md-4">
            <div className="card border-primary h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase small mb-1">Total Events</h6>
                    <h3 className="mb-0 text-primary">{events.length}</h3>
                  </div>
                  <div className="text-primary fs-1 opacity-25">
                    <i className="bi bi-calendar-event"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-success h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase small mb-1">Total Registrations</h6>
                    <h3 className="mb-0 text-success">{analyticsStats.totalRegs}</h3>
                  </div>
                  <div className="text-success fs-1 opacity-25">
                    <i className="bi bi-people"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-warning h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h6 className="text-muted text-uppercase small mb-1">Selected Event</h6>
                    <h5 className="mb-0">
                      {selectedEventId
                        ? events.find(e => e.eid === selectedEventId)?.ename || `ID ${selectedEventId}`
                        : "None"}
                    </h5>
                  </div>
                  <div className="text-warning fs-1 opacity-25">
                    <i className="bi bi-star"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-graph-up me-2"></i>Event Analytics
            </h5>
          </div>
          <div className="card-body">
            {loadingAnalytics && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {!loadingAnalytics && analytics.length === 0 && (
              <p className="text-muted text-center py-4 mb-0">
                No analytics data available yet. Create events to see analytics.
              </p>
            )}

            {!loadingAnalytics && analytics.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Event Name</th>
                      <th>State</th>
                      <th>City</th>
                      <th>Registrations</th>
                      <th>Age Distribution</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.map(ev => (
                      <tr key={ev.eventId || ev.event_id}>
                        <td className="fw-semibold">{ev.eventName || ev.event_name}</td>
                        <td><span className="badge bg-secondary">{ev.stateName || ev.state_name}</span></td>
                        <td><span className="badge bg-info">{ev.cityName || ev.city_name}</span></td>
                        <td>{ev.totalRegistrations || ev.total_registrations}</td>
                        <td>
                          {(!ev.ageBuckets || ev.ageBuckets.length === 0) ? (
                            <span className="text-muted small">No age data</span>
                          ) : (
                            <div className="d-flex flex-wrap gap-1">
                              {(ev.ageBuckets || []).map((bucket, idx) => {
                                const from = Math.max(0, bucket.fromAge ?? bucket.from_age ?? 0);
                                const to = bucket.toAge ?? bucket.to_age ?? from + 9;
                                return (
                                  <span key={idx} className="badge bg-primary">
                                    {from}-{to} yrs: {bucket.count}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Events List */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="bi bi-list-ul me-2"></i>My Events ({events.length})
              </h5>
              {loadingEvents && (
                <span className="text-muted small">
                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  Loading...
                </span>
              )}
            </div>
          </div>
          <div className="card-body">
            {events.length === 0 && !loadingEvents && (
              <div className="text-center py-5">
                <i className="bi bi-calendar-x fs-1 text-muted mb-3 d-block"></i>
                <p className="text-muted mb-3">No events yet.</p>
                <button className="btn btn-primary" onClick={() => navigate("/organizer/create-event")}>
                  <i className="bi bi-plus-circle me-1"></i>Create Your First Event
                </button>
              </div>
            )}

            {events.length > 0 && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Fee</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(e => (
                      <tr key={e.eid} className={selectedEventId === e.eid ? "table-primary" : ""}>
                        <td>{e.eid}</td>
                        <td className="fw-semibold">{e.ename || e.eventName}</td>
                        <td>{e.date ? String(e.date).substring(0, 10) : "-"}</td>
                        <td>{e.time ? String(e.time).substring(0, 5) : "-"}</td>
                        <td>₹{e.fair || e.fee}</td>
                        <td>{e.capacity ?? "-"}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(e.status)}`}>
                            {getStatusLabel(e.status)}
                          </span>
                        </td>
                        <td>
                          {getCityName(
                            getVenueCityId(getVenue(e.vid, venues) ?? {}),
                            cities
                          )}, {getStateName(
                            getVenueStateId(getVenue(e.vid, venues) ?? {}),
                            states
                          )}
                        </td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm" role="group">
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => viewRegistrations(e.eid)}
                              title="View Registrations"
                            >
                              <i className="bi bi-list-check"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => navigate(`/organizer/manage-events?edit=${e.eid}`)}
                              title="Edit Event"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            {(analytics.find(a => (a.eventId ?? a.event_id) === e.eid)?.totalRegistrations ?? 0) === 0 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => deleteEvent(e.eid)}
                                title="Delete Event"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Registrations & Announcement */}
        {selectedEventId && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-people me-2"></i>
                Registrations for: {events.find(e => e.eid === selectedEventId)?.ename || `Event ID ${selectedEventId}`}
              </h5>
            </div>
            <div className="card-body">
              {loadingRegs && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}

              {registrations.length === 0 && !loadingRegs && (
                <p className="text-muted text-center py-4 mb-0">No registrations for this event yet.</p>
              )}

              {registrations.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Registration #</th>
                        <th>Attendee Name</th>
                        <th>Party Size</th>
                      </tr>
                    </thead>
                    <tbody>
                      {registrations.map(r => (
                        <tr key={r.regId || r.reg_id}>
                          <td>{r.regId ?? r.reg_id}</td>
                          <td>{r.attendeeName ?? r.attendee_name ?? `Attendee #${r.attId ?? r.att_id}`}</td>
                          <td><span className="badge bg-primary">{r.noOfPeople ?? r.no_of_people}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <hr />

              <div>
                <h6 className="mb-3">
                  <i className="bi bi-megaphone me-2"></i>Send Announcement
                </h6>
                <textarea
                  className="form-control mb-3"
                  rows={3}
                  placeholder="Type your announcement message..."
                  value={announcementMessage}
                  onChange={e => setAnnouncementMessage(e.target.value)}
                />
                <button
                  className="btn btn-success"
                  onClick={sendAnnouncement}
                  disabled={sendingAnnouncement}
                >
                  {sendingAnnouncement ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>Send Announcement
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
