import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { UserAuthContextProvider } from './context/UserAuthContext.jsx'
import { 
  createBrowserRouter, 
  RouterProvider, 
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import Home from './page/Home.jsx'
import Booking from './page/Booking.jsx'
import Todo from './page/Todo.jsx'
import Profile from './page/Profile.jsx'
import Famous from './page/Famous.jsx'
import Community from './page/Community.jsx'
import Promotion from './page/Promotion.jsx'
import Sightseeing from './page/Sightseeing.jsx'
import Bookinghistory from './page/Bookinghistory.jsx'
import Reportproblem from './page/Reportproblem.jsx'

import Ex from './page/Ex.jsx'

import Map from './page/map.jsx'
import Gpscar from './page/Gpscar.jsx'

import Test from './page/test.jsx'

import Addcommunity from './page/manupage/Addcommunity.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Booking",
    element: <Booking />,
  },
  {
    path: "/Todo",
    element: <Todo />,
  },
  {
    path: "/Gpscar",
    element: <Gpscar />,
  },
  {
    path: "/Ex",
    element: <Ex />,
  },
  {
    path: "/Profile",
    element: <Profile />,
  },
  {
    path: "/Famous",
    element: <Famous />,
  },
  {
    path: "/Community",
    element: <Community />,
  },
  {
    path: "/Addcommunity",
    element: <Addcommunity />,
  },
  {
    path: "/Promotion",
    element: <Promotion />,
  },
  {
    path: "/Map",
    element: <Map />,
  },
  {
    path: "/Sightseeing",
    element: <Sightseeing />,
  },
  {
    path: "/Bookinghistory",
    element: <Bookinghistory />,
  },
  {
    path: "/Reportproblem",
    element: <Reportproblem />,
  },
  {
    path: "/Test",
    element: <Test />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router}/>
    </UserAuthContextProvider>
  </React.StrictMode>
)
