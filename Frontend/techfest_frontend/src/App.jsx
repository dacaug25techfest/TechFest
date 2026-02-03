import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Common
import Navbar from "./Navbar";

// Public pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Attendee pages
import AttendeeProfile from "./pages/AttendeeProfile";
import Events from "./pages/Events";
import MyTickets from "./pages/MyTickets";

// Organizer pages
import OrganizerDashboard from "./organizer/OrganizerDashboard";
import CreateEvent from "./organizer/CreateEvent";
import ManageEvents from "./organizer/ManageEvents";
import ViewRegistrations from "./organizer/ViewRegistrations";
import Announcement from "./organizer/Announcement";
import OrganizerAnalytics from "./organizer/OrganizerAnalytics";

// Admin pages
import AdminDashboard from "./admin/AdminDashboard";
import ApproveEvents from "./admin/ApproveEvents";
//import ManageUsers from "./admin/ManageUsers";

function App() {
  return (
    <Router>
      <Navbar />

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
        <Route
          path="/organizer/registrations"
          element={<ViewRegistrations />}
        />
        <Route path="/organizer/announcement" element={<Announcement />} />
        <Route path="/organizer/analytics" element={<OrganizerAnalytics />} />

        {/* ===== ADMIN ===== */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/approve-events" element={<ApproveEvents />} />
        {/* <Route path="/admin/manage-users" element={<ManageUsers />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
