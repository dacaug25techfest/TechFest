import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginComp from './components/LoginComp';
import RegisterComp from './components/RegisterComp';
import AppHome from './components/AppHome';
import { Link,Outlet,Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar/>
      <Outlet/>

    </>
  )
}

export default App
