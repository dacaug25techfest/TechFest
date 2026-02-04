import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const API = "http://localhost:5041/organizer";

// Lookup helpers - handle both camelCase and PascalCase
const getStateId = s => s?.stateId ?? s?.StateId ?? s?.state_id ?? s?.id;
const getStateLabel = s => s?.sname ?? s?.Sname ?? s?.stateName ?? s?.name ?? "";

const getCityId = c => c?.cityId ?? c?.CityId ?? c?.city_id ?? c?.id;
const getCityStateId = c => c?.sid ?? c?.StateId ?? c?.stateId ?? c?.state_id;
const getCityLabel = c => c?.cname ?? c?.Cname ?? c?.cityName ?? c?.name ?? "";

const getVenueStateId = v => v?.sid ?? v?.StateId ?? v?.stateId ?? v?.state_id;
const getVenueCityId = v => v?.cid ?? v?.CityId ?? v?.cityId ?? v?.city_id;

export default function CreateEvent() {
  const navigate = useNavigate();

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const ORGANIZER_ID = storedUser?.uid ?? null;

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [venues, setVenues] = useState([]);

  const [form, setForm] = useState({
    ename: "",
    date: "",
    time: "",
    fair: "",
    vid: "",
    description: "",
    capacity: "",
    organizerId: ORGANIZER_ID,
  });

  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!ORGANIZER_ID) {
      navigate("/login");
      return;
    }
    loadLookups();
  }, [ORGANIZER_ID, navigate]);

  const loadLookups = async () => {
    setLoadingData(true);
    setError("");

    try {
      console.log("Loading states, cities, and venues from:", API);
      const [statesRes, citiesRes, venuesRes] = await Promise.all([
        axios.get(`${API}/states`).catch(err => ({ data: [], error: err })),
        axios.get(`${API}/cities`).catch(err => ({ data: [], error: err })),
        axios.get(`${API}/venues`).catch(err => ({ data: [], error: err })),
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
        console.log("State keys:", Object.keys(statesData[0]));
      } else {
        console.warn("⚠️ No states returned from API!");
        setError("No states found. Please ensure backend is running and database has state records.");
      }

      setStates(statesData);
      setCities(citiesData);
      setVenues(venuesData);
    } catch (err) {
      console.error("Failed to load lookup data", err);
      console.error("Error response:", err.response);
      console.error("Error message:", err.message);
      setError(`Failed to load location data: ${err.response?.data?.message || err.message || "Please check if the backend is running on port 5041"}`);
    } finally {
      setLoadingData(false);
    }
  };

  const updateField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleStateChange = (e) => {
    const newStateId = e.target.value;
    setSelectedStateId(newStateId);
    setSelectedCityId("");
    updateField("vid", "");
  };

  const handleCityChange = (e) => {
    const newCityId = Number(e.target.value);
    setSelectedCityId(e.target.value);

    const venueForCity = venues.find(
      v =>
        getVenueStateId(v) === Number(selectedStateId) &&
        getVenueCityId(v) === newCityId
    );

    if (venueForCity) {
      updateField("vid", venueForCity.vid ?? venueForCity.Vid);
    } else {
      updateField("vid", "");
      alert("No venue found for this location. Please select a different city.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.ename || !form.date || !form.time || !form.fair || !form.capacity || !form.vid) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!selectedStateId || !selectedCityId) {
      setError("Please select both state and city.");
      return;
    }

    const payload = {
      ename: form.ename,
      vid: Number(form.vid),
      time: form.time.length === 5 ? form.time + ":00" : form.time,
      date: form.date,
      fair: parseFloat(form.fair),
      description: form.description || "",
      capacity: parseInt(form.capacity, 10),
      organizerId: Number(ORGANIZER_ID),
    };

    try {
      setSaving(true);
      await axios.post(`${API}/event`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Event created successfully!");
      navigate("/organizer");
    } catch (err) {
      console.error("Failed to create event", err?.response || err);
      const serverMsg =
        err?.response?.data && typeof err.response.data === "string"
          ? err.response.data
          : err?.response?.data?.message || "";

      if (serverMsg.includes("not approved")) {
        setError("⚠️ Your account is pending approval. You cannot create events until an admin approves your account.");
      } else {
        setError(
          serverMsg
            ? `Failed to create event: ${serverMsg}`
            : "Failed to create event. Please check the details and try again."
        );
      }
    } finally {
      setSaving(false);
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
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/organizer">Dashboard</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/organizer/create-event">Create Event</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/manage-events">Manage Events</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/registrations">Registrations</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/organizer/analytics">Analytics</Link>
              </li>
            </ul>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 fw-bold mb-1">Create New Event</h1>
            <p className="text-muted mb-0">Fill in the details below to create a new technical event</p>
          </div>
          <Link to="/organizer" className="btn btn-outline-secondary">
            <i className="bi bi-arrow-left me-1"></i>Back to Dashboard
          </Link>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card shadow-lg border-0">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-calendar-plus me-2"></i>Event Details
                </h5>
              </div>
              <div className="card-body p-4">
                {/* Approval Warning */}
                {storedUser && storedUser.isApproved === false && (
                  <div className="alert alert-warning border-warning shadow-sm mb-4">
                    <div className="d-flex">
                      <div className="fs-1 me-3">⚠️</div>
                      <div>
                        <h4 className="alert-heading fw-bold">Account Pending Approval</h4>
                        <p className="mb-0">
                          Your organizer account is currently pending administrator approval.
                          You cannot create events until your account is approved.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                  </div>
                )}

                {loadingData && (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted mt-3">Loading form data...</p>
                  </div>
                )}

                {!loadingData && (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Event Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Coding Hackathon 2024"
                        value={form.ename}
                        onChange={e => updateField("ename", e.target.value)}
                        required
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Date <span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          value={form.date}
                          onChange={e => updateField("date", e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Time <span className="text-danger">*</span>
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          value={form.time}
                          onChange={e => updateField("time", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Registration Fee (₹) <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="form-control"
                          placeholder="e.g. 199.00"
                          value={form.fair}
                          onChange={e => updateField("fair", e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          Event Capacity <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          placeholder="e.g. 100"
                          value={form.capacity}
                          onChange={e => updateField("capacity", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          State <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedStateId}
                          onChange={handleStateChange}
                          required
                        >
                          <option value="">Select state</option>
                          {states.map((state, idx) => {
                            const stateId = getStateId(state);
                            const stateLabel = getStateLabel(state);
                            console.log(`State ${idx}:`, state, "ID:", stateId, "Label:", stateLabel);
                            return (
                              <option key={stateId || idx} value={stateId || ""}>
                                {stateLabel || `State ${stateId}`}
                              </option>
                            );
                          })}
                        </select>
                        {states.length === 0 && !loadingData && (
                          <small className="text-danger d-block mt-1">
                            No states available. Please check backend connection and database.
                          </small>
                        )}
                        {states.length > 0 && (
                          <small className="text-success d-block mt-1">
                            {states.length} state(s) loaded
                          </small>
                        )}
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-semibold">
                          City <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          value={selectedCityId}
                          onChange={handleCityChange}
                          disabled={!selectedStateId}
                          required
                        >
                          <option value="">Select city</option>
                          {cities
                            .filter(c =>
                              selectedStateId
                                ? getCityStateId(c) === Number(selectedStateId)
                                : false
                            )
                            .map((city, idx) => {
                              const cityId = getCityId(city);
                              const cityLabel = getCityLabel(city);
                              return (
                                <option key={cityId || idx} value={cityId || ""}>
                                  {cityLabel || `City ${cityId}`}
                                </option>
                              );
                            })}
                        </select>
                        {selectedStateId && !selectedCityId && (
                          <small className="text-muted d-block mt-1">Please select a city</small>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="Provide a detailed description of your event..."
                        value={form.description}
                        onChange={e => updateField("description", e.target.value)}
                      />
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={saving || (storedUser && storedUser.isApproved === false)}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>Create Event
                          </>
                        )}
                      </button>
                      <Link to="/organizer" className="btn btn-outline-secondary btn-lg">
                        Cancel
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
