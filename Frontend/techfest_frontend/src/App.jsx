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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
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
      </Routes>
    </Router>
  );
>>>>>>> 5c5ee2a1357b06db18abf98e13596262b9748daf
}

export default App;
