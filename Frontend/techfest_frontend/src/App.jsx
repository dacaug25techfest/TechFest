<<<<<<< HEAD
<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginComp from './components/LoginComp';
import RegisterComp from './components/RegisterComp';
import AppHome from './components/AppHome';
import { Link,Outlet,Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
=======
=======
import React from 'react';
>>>>>>> 17c6540073f37951078d9f314c5d251a94487bb1
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import AttendeeProfile from './pages/AttendeeProfile';
import Events from './pages/Events';
import MyTickets from './pages/MyTickets';
import './App.css';
>>>>>>> 5c5ee2a1357b06db18abf98e13596262b9748daf

function App() {
  return (
<<<<<<< HEAD
    <>
      <Navbar/>
      <Outlet/>

    </>
  )
=======
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
>>>>>>> 5c5ee2a1357b06db18abf98e13596262b9748daf
}

export default App;
