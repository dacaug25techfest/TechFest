import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

const API = "http://localhost:8080/organizer";

/* =======================
   Lookup helpers
======================= */
const getVenue = (vid, venues) =>
  venues.find(v => (v.vid ?? v.Vid) === Number(vid));

const getStateId = s => s.stateId ?? s.StateId;
const getStateLabel = s => s.sname ?? s.Sname;

const getCityId = c => c.cityId ?? c.CityId;
const getCityStateId = c => c.sid ?? c.StateId;
const getCityLabel = c => c.cname ?? c.Cname;

const getVenueStateId = v => v?.sid ?? v?.StateId ?? v?.stateId;
const getVenueCityId = v => v?.cid ?? v?.CityId ?? v?.cityId;

const getStateName = (stateId, states) => {
  const s = states.find(st => getStateId(st) === Number(stateId));
  return s ? getStateLabel(s) : "-";
};

const getCityName = (cityId, cities) => {
  const c = cities.find(ct => getCityId(ct) === Number(cityId));
  return c ? getCityLabel(c) : "-";
};

/* =======================
   Component
======================= */
export default function ManageEvents() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editEventId = searchParams.get("edit");

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

  const [editingEvent, setEditingEvent] = useState(null);
  const [form, setForm] = useState({
    eid: "",
    ename: "",
    date: "",
    time: "",
    fair: "",
    vid: "",
    description: "",
    capacity: "",
  });

  const [selectedStateId, setSelectedStateId] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [saving, setSaving] = useState(false);

  /* =======================
     Effects
  ======================= */
  useEffect(() => {
    if (!ORGANIZER_ID) {
      navigate("/login");
      return;
    }
    loadEvents();
    loadLookups();
    loadAnalytics();
  }, [ORGANIZER_ID, navigate]);

  useEffect(() => {
    if (editEventId && events.length > 0) {
      const eventToEdit = events.find(e => e.eid === Number(editEventId));
      if (eventToEdit) startEdit(eventToEdit);
    }
  }, [editEventId, events]);

  /* =======================
     API calls
  ======================= */
  const loadEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await axios.get(`${API}/dashboard/${ORGANIZER_ID}`);
      setEvents(res.data || []);
    } catch {
      setError("Failed to load events.");
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadLookups = async () => {
    try {
      const [s, c, v] = await Promise.all([
        axios.get(`${API}/states`),
        axios.get(`${API}/cities`),
        axios.get(`${API}/venues`)
      ]);
      setStates(s.data || []);
      setCities(c.data || []);
      setVenues(v.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAnalytics = async () => {
    if (!ORGANIZER_ID) return;
    try {
      const res = await axios.get(`${API}/analytics/${ORGANIZER_ID}`);
      setAnalytics(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* =======================
     Handlers
  ======================= */
  const startEdit = (eventObj) => {
    setEditingEvent(eventObj.eid);

    const venue = getVenue(eventObj.vid, venues);
    const stateId = venue ? getVenueStateId(venue) : "";
    const cityId = venue ? getVenueCityId(venue) : "";

    setForm({
      eid: eventObj.eid,
      ename: eventObj.ename || "",
      date: eventObj.date ? String(eventObj.date).substring(0, 10) : "",
      time: eventObj.time ? String(eventObj.time).substring(0, 5) : "",
      fair: eventObj.fair?.toString() || "",
      vid: eventObj.vid || "",
      description: eventObj.description || "",
      capacity: eventObj.capacity?.toString() || "",
    });

    setSelectedStateId(stateId ? String(stateId) : "");
    setSelectedCityId(cityId ? String(cityId) : "");
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setForm({
      eid: "",
      ename: "",
      date: "",
      time: "",
      fair: "",
      vid: "",
      description: "",
      capacity: "",
    });
    setSelectedStateId("");
    setSelectedCityId("");
    navigate("/organizer/manage-events");
  };

  const updateField = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleStateChange = (e) => {
    setSelectedStateId(e.target.value);
    setSelectedCityId("");
    updateField("vid", "");
  };

  const handleCityChange = (e) => {
    const cityId = Number(e.target.value);
    setSelectedCityId(String(cityId));

    const venue = venues.find(
      v =>
        getVenueStateId(v) === Number(selectedStateId) &&
        getVenueCityId(v) === cityId
    );

    if (venue) updateField("vid", venue.vid ?? venue.Vid);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.ename || !form.date || !form.time || !form.fair || !form.capacity || !form.vid) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      await axios.put(`${API}/event`, {
        ...form,
        fair: Number(form.fair),
        capacity: Number(form.capacity),
        vid: Number(form.vid),
        organizerId: ORGANIZER_ID,
      });
      alert("Event updated successfully!");
      cancelEdit();
      loadEvents();
    } catch {
      setError("Failed to update event.");
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (eid) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await axios.delete(`${API}/event/${eid}`);
      setEvents(prev => prev.filter(e => e.eid !== eid));
      loadAnalytics();
    } catch (err) {
      console.error(err);
      alert("Failed to delete event.");
    }
  };

  const hasRegistrations = (eid) =>
    (analytics.find(a => (a.eventId ?? a.event_id) === eid)?.totalRegistrations ?? 0) > 0;

  /* =======================
     JSX
  ======================= */
  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Manage Events</h2>

      {editingEvent && (
        <form onSubmit={handleUpdate} className="card p-3 mb-4">
          <input
            className="form-control mb-2"
            value={form.ename}
            onChange={e => updateField("ename", e.target.value)}
            placeholder="Event Name"
          />
          <button className="btn btn-primary" disabled={saving}>
            {saving ? "Updating..." : "Update Event"}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={cancelEdit}>
            Cancel
          </button>
        </form>
      )}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map(e => (
            <tr key={e.eid}>
              <td>{e.eid}</td>
              <td>{e.ename}</td>
              <td>
                {getCityName(getVenueCityId(getVenue(e.vid, venues)), cities)},
                {" "}
                {getStateName(getVenueStateId(getVenue(e.vid, venues)), states)}
              </td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(e)}>Edit</button>
                {!hasRegistrations(e.eid) && (
                  <button className="btn btn-sm btn-danger" onClick={() => deleteEvent(e.eid)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
