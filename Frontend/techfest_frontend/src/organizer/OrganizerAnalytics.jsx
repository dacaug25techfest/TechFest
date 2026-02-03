import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API = "http://localhost:5041/organizer";

export default function OrganizerAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();
  const ORGANIZER_ID = storedUser?.uid ?? null;

  useEffect(() => {
    if (!ORGANIZER_ID) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${API}/analytics/${ORGANIZER_ID}`);
        setData(res.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [ORGANIZER_ID]);

  const totalPeople = useMemo(
    () => data.reduce((sum, ev) => sum + (ev.totalPeople || 0), 0),
    [data]
  );

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold mb-0">Event & Attendee Analytics</h2>
        <span className="text-muted">Organizer ID: {ORGANIZER_ID}</span>
      </div>

      {loading && <p>Loading analytics...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && data.length === 0 && (
        <p className="text-muted">No analytics data available yet.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-muted mb-1">Events</h6>
                  <h3 className="mb-0">{data.length}</h3>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h6 className="text-muted mb-1">Total People Registered</h6>
                  <h3 className="mb-0">{totalPeople}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">Events by Location & Age Range</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Event</th>
                      <th>State</th>
                      <th>City</th>
                      <th>Total Registrations</th>
                      <th>Total People</th>
                      <th>Age Buckets (Count)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map(ev => (
                      <tr key={ev.eventId}>
                        <td className="fw-semibold">{ev.eventName}</td>
                        <td>{ev.stateName}</td>
                        <td>{ev.cityName}</td>
                        <td>{ev.totalRegistrations}</td>
                        <td>{ev.totalPeople}</td>
                        <td>
                          {(!ev.ageBuckets || ev.ageBuckets.length === 0) && (
                            <span className="text-muted">No age data</span>
                          )}
                          {ev.ageBuckets && ev.ageBuckets.length > 0 && (
                            <div className="d-flex flex-wrap gap-1">
                              {ev.ageBuckets.map(bucket => (
                                <span
                                  key={`${bucket.fromAge}-${bucket.toAge}`}
                                  className="badge bg-secondary"
                                >
                                  {bucket.fromAge}-{bucket.toAge}: {bucket.count}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

