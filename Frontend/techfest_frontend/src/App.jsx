import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AttendeeProfile from './pages/AttendeeProfile';
import Events from './pages/Events';
import MyTickets from './pages/MyTickets';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminOrganizers from './pages/admin/AdminOrganizers';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute';
import AdminLogin from './admin/AdminLogin';
import OrganizerDashboard from './organizer/OrganizerDashboard';
import CreateEvent from './organizer/CreateEvent';
import ManageEvents from './organizer/ManageEvents';
import ViewRegistrations from './organizer/ViewRegistrations';
import Announcement from './organizer/Announcement';
import OrganizerAnalytics from './organizer/OrganizerAnalytics';
import './App.css';

function App() {
  return (
    <Router>


      <Routes>
        {/* ===== PUBLIC ===== */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ===== ATTENDEE ===== */}
        <Route path="/attendee/profile" element={<AttendeeProfile />} />
        <Route path="/attendee/events" element={<Events />} />
        <Route path="/attendee/tickets" element={<MyTickets />} />

        {/* ===== ORGANIZER ===== */}
        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer/create-event" element={<CreateEvent />} />
        <Route path="/organizer/manage-events" element={<ManageEvents />} />
        <Route path="/organizer/registrations" element={<ViewRegistrations />} />
        <Route path="/organizer/announcement" element={<Announcement />} />
        <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />

        {/* ===== ADMIN ===== */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="events/pending" element={<AdminEvents />} />
          <Route path="organizers" element={<AdminOrganizers />} />
          <Route path="feedback" element={<AdminFeedback />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
