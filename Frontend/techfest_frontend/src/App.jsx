import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AttendeeProfile from './pages/AttendeeProfile';
import Events from './pages/Events';
import MyTickets from './pages/MyTickets';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminOrganizers from './pages/admin/AdminOrganizers';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminProtectedRoute from './pages/admin/AdminProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/attendee/profile" element={<AttendeeProfile />} />
        <Route path="/attendee/events" element={<Events />} />
        <Route path="/attendee/tickets" element={<MyTickets />} />
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
