import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [rating, setRating] = useState({});
  const [remark, setRemark] = useState({});

  const navigate = useNavigate();

  const getCurrentUser = () => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchTickets = async () => {
      try {
        const res = await fetch(
          `http://localhost:8082/api/attendee/tickets/${user.uid}`
        );
        if (!res.ok) {
          throw new Error('Failed to load tickets');
        }
        const data = await res.json();
        setTickets(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTickets();
  }, [navigate]);

  const handleFeedbackSubmit = async (ticket) => {
    const user = getCurrentUser();
    if (!user) return;

    const r = Number(rating[ticket.ticketNo] || 0);
    const rm = (remark[ticket.ticketNo] || '').trim();
    if (!r || r < 1 || r > 5) {
      alert('Rating must be between 1 and 5');
      return;
    }

    try {
      const res = await fetch('http://localhost:8082/api/attendee/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          eid: ticket.eid,
          rating: r,
          remark: rm,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit feedback');
      }

      alert('Feedback submitted. Thank you!');
      setRating((prev) => ({ ...prev, [ticket.ticketNo]: '' }));
      setRemark((prev) => ({ ...prev, [ticket.ticketNo]: '' }));
    } catch (err) {
      console.error(err);
      alert('Could not submit feedback');
    }
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">TechFest</div>
          <nav className="nav-links">
            <button className="nav-link" type="button">
              My Tickets
            </button>
          </nav>
          <div className="nav-actions">
            <Link to="/attendee/events" className="btn-outline">
              Events
            </Link>
            <button
              type="button"
              className="btn-primary"
              onClick={() => {
                localStorage.removeItem('user');
                navigate('/login');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Your Registrations & Tickets</h2>
          <p className="section-subtitle">
            View all events you have registered for and share your feedback.
          </p>

          <div className="features-grid">
            {tickets.length === 0 && (
              <p className="section-subtitle">No tickets found.</p>
            )}

            {tickets.map((ticket) => (
              <div key={ticket.ticketNo} className="feature-card">
                <h3 className="feature-title">{ticket.ename}</h3>
                <p className="feature-description">
                  Ticket No: {ticket.ticketNo}
                </p>
                <p className="feature-description">
                  Date: {ticket.date} | Time: {ticket.time}
                </p>
                <p className="feature-description">
                  No. of Attendees: {ticket.noOfAttendee}
                </p>
                <p className="feature-description">Amount: ₹{ticket.amt}</p>

                <div style={{ marginTop: '1rem' }}>
                  <p className="feature-description">
                    <strong>Give Feedback (1–5)</strong>
                  </p>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="form-input"
                    style={{ maxWidth: '80px' }}
                    value={rating[ticket.ticketNo] || ''}
                    onChange={(e) =>
                      setRating((prev) => ({
                        ...prev,
                        [ticket.ticketNo]: e.target.value,
                      }))
                    }
                  />
                  <textarea
                    className="form-input"
                    rows="2"
                    placeholder="Write your feedback"
                    style={{ marginTop: '0.5rem' }}
                    value={remark[ticket.ticketNo] || ''}
                    onChange={(e) =>
                      setRemark((prev) => ({
                        ...prev,
                        [ticket.ticketNo]: e.target.value,
                      }))
                    }
                  />
                  <button
                    type="button"
                    className="btn-primary"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => handleFeedbackSubmit(ticket)}
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyTickets;

