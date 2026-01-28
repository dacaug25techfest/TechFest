import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './store.js'
// import {Provider} from 'react-router-dom'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginComp from './components/LoginComp.jsx'
import AppHome from './components/AppHome.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"/login",
        element:<LoginComp/>
      },
      {
        path:"/home",
        element:<AppHome/>
      }
    ]
  },
  
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router}>

  </RouterProvider>
  </StrictMode>,
)
