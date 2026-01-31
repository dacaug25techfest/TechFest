import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Landing.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'registrations'
  const [lastTicket, setLastTicket] = useState(null);
  const [tickets, setTickets] = useState([]);

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

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:8082/api/attendee/events');
        if (!res.ok) {
          throw new Error('Failed to load events');
        }
        const eventsData = await res.json();
        setEvents(eventsData);

        const ticketsRes = await fetch(
          `http://localhost:8082/api/attendee/tickets/${user.uid}`
        );
        if (ticketsRes.ok) {
          const ticketsData = await ticketsRes.json();
          setTickets(ticketsData);
        }
      } catch (err) {
        console.error(err);
        setError('Unable to load events right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleRegister = async (eventId) => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      const res = await fetch('http://localhost:8082/api/attendee/register-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid: user.uid,
          eid: eventId,
          noOfPeople: 1, // single ticket per registration
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || 'Registration failed');
      }

      const ticketData = await res.json();
      setLastTicket(ticketData);
      setActiveTab('registrations');

      // Refresh events & tickets to show updated capacity / registrations
      const eventsRes = await fetch('http://localhost:8082/api/attendee/events');
      if (eventsRes.ok) {
        setEvents(await eventsRes.json());
      }

      const ticketsRes = await fetch(
        `http://localhost:8082/api/attendee/tickets/${user.uid}`
      );
      if (ticketsRes.ok) {
        setTickets(await ticketsRes.json());
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to register for event');
    }
  };

  return (
    <div className="landing-page">
      <header className="navbar">
        <div className="navbar-container">
          <div className="logo">TechFest</div>
          <nav className="nav-links">
            <span className="nav-link">Events</span>
          </nav>
          <div className="nav-actions">
            <button
              type="button"
              className="btn-outline"
              onClick={() => setActiveTab('browse')}
            >
              Browse
            </button>
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
          {/* Dashboard header */}
          <div className="hero" style={{ padding: '2rem 0 1rem' }}>
            <h1 className="hero-title">
              Welcome back, {getCurrentUser()?.username || getCurrentUser()?.name || 'Attendee'}!
            </h1>
            <p className="hero-subtitle">
              Discover amazing events and manage your registrations.
            </p>
          </div>

          {/* Stats pills */}
          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <div className="feature-card" style={{ padding: '0.75rem 1.5rem' }}>
              <p className="feature-title" style={{ marginBottom: 0 }}>
                {tickets.length}
              </p>
              <p className="feature-description" style={{ marginBottom: 0 }}>
                Registered
              </p>
            </div>
            <div className="feature-card" style={{ padding: '0.75rem 1.5rem' }}>
              <p className="feature-title" style={{ marginBottom: 0 }}>
                {events.length}
              </p>
              <p className="feature-description" style={{ marginBottom: 0 }}>
                Available
              </p>
            </div>
          </div> */}

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <button
              type="button"
              className={
                activeTab === 'browse' ? 'btn-primary btn-large' : 'btn-outline btn-large'
              }
              onClick={() => setActiveTab('browse')}
            >
              Browse Events
            </button>
            <button
              type="button"
              className={
                activeTab === 'registrations'
                  ? 'btn-primary btn-large'
                  : 'btn-outline btn-large'
              }
              onClick={() => setActiveTab('registrations')}
            >
              My Registrations
            </button>
          </div>

          {/* Last ticket banner */}
          {lastTicket && activeTab === 'browse' && (
            <div className="feature-card" style={{ marginBottom: '1.5rem' }}>
              <h3 className="feature-title">Ticket booked successfully!</h3>
              <p className="feature-description">
                Ticket No: {lastTicket.ticketNo} &nbsp;|&nbsp; Event: {lastTicket.ename}{' '}
                &nbsp;|&nbsp; Amount: ₹{lastTicket.amt}
              </p>
            </div>
          )}

          {isLoading && <p className="section-subtitle">Loading...</p>}
          {error && <p className="section-subtitle">{error}</p>}

          {!isLoading && !error && activeTab === 'browse' && (
            <>
              <h2 className="section-title">Browse Events</h2>
              <p className="section-subtitle">
                Browse all upcoming technical events and pick the ones that excite you.
              </p>
              <div className="features-grid">
                {events.length === 0 && (
                  <p className="section-subtitle">No events found in the system.</p>
                )}

                {events.map((event) => (
                  <div key={event.eid} className="feature-card">
                    <h3 className="feature-title">{event.ename}</h3>
                    <p className="feature-description">
                      Date: {event.date} | Time: {event.time}
                    </p>
                    <p className="feature-description">
                      Fee: ₹{event.fair} | Capacity: {event.capacity}
                    </p>
                    {event.description && (
                      <p className="feature-description">{event.description}</p>
                    )}
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => handleRegister(event.eid)}
                    >
                      Register
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {!isLoading && !error && activeTab === 'registrations' && (
            <>
              <h2 className="section-title">My Registrations</h2>
              <p className="section-subtitle">
                View the events you have registered for.
              </p>
              <div className="features-grid">
                {tickets.length === 0 && (
                  <p className="section-subtitle">You have not registered for any events.</p>
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
                      Amount: ₹{ticket.amt}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default Events;

