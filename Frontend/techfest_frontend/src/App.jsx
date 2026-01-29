import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AttendeeProfile from './pages/AttendeeProfile';
import Events from './pages/Events';
import MyTickets from './pages/MyTickets';
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
      </Routes>
    </Router>
  );
}

export default App;
