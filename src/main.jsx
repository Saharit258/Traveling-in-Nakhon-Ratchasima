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

import ProtectedRoute from './auth/ProtectedRoute.jsx';

import Login from './components/Login.jsx'
import LoginP from './components/LoginP.jsx'
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
import Famouspage from './page/manupage/Famouspage.jsx'
import Bookingcard from './page/manupage/Bookingcard.jsx'
import Bookingroomcard from './page/manupage/Bookingroomcard.jsx'
import Mycoupon from './page/Mycoupon.jsx'
import Expend from './page/manupage/Expend.jsx'
import Gpshotel from './page/Gpshotel.jsx'
import Usecoupon from './page/Usecoupon.jsx'
import Ex from './page/Ex.jsx'
import Map from './page/map.jsx'
import Gpscar from './page/Gpscar.jsx'
import Test from './page/test.jsx'
import Addcommunity from './page/manupage/Addcommunity.jsx'

import Partnerhome from './partner/Partnerhome.jsx'
import Bookingpartner from './partner/Bookingpartner.jsx'
import Bookingpartners from './partner/Bookingpartners.jsx'
import Probiemp from './partner/Probiemp.jsx'
import Roomadd from './partner/Roomadd.jsx'
import AddRoom from './partner/AddRoom.jsx'
import Hotel from './partner/Hotel.jsx'
import Property from './page/Property.jsx'

import LoginAdmin from './admin/LoginAdmin.jsx'
import HomeAdmin from './admin/HomeAdmin.jsx'
import HotelAdmin from './admin/HotelAdmin.jsx'
import UserAdmin from './admin/UserAdmin.jsx'
import ShowproblemAdmin from './admin/ShowproblemAdmin.jsx'
import CalendarAdmin from './admin/CalenderAdmin.jsx'
import CommunityAdmin from './admin/CommunityAdmin.jsx'
import FamousAdmin from './admin/FamousAdmin.jsx'
import FamousAdminAdd from './admin/FamousAdminAdd.jsx'

const router = createBrowserRouter([
  {
    path: "/LoginAdmin",
    element: <LoginAdmin />,
  },
  {
    path: "/HomeAdmin",
    element: <ProtectedRoute><HomeAdmin /></ProtectedRoute>
  },
  {
    path: "/HotelAdmin",
    element: <ProtectedRoute><HotelAdmin /></ProtectedRoute>
  },
  {
    path: "/UserAdmin",
    element: <ProtectedRoute><UserAdmin /></ProtectedRoute>
  },
  {
    path: "/ShowproblemAdmin",
    element: <ProtectedRoute><ShowproblemAdmin /></ProtectedRoute>
  },
  {
    path: "/CalendarAdmin",
    element: <ProtectedRoute><CalendarAdmin /></ProtectedRoute>
  },
  {
    path: "/CommunityAdmin",
    element: <ProtectedRoute><CommunityAdmin /></ProtectedRoute>
  },
  {
    path: "/FamousAdmin",
    element: <ProtectedRoute><FamousAdmin /></ProtectedRoute>
  },
  {
    path: "/FamousAdminAdd",
    element: <ProtectedRoute><FamousAdminAdd /></ProtectedRoute>
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/LoginP",
    element: <LoginP />,
  },
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/Hotel",
    element: <Hotel />,
  },
  {
    path: "/Roomadd",
    element: <Roomadd />,
  },
  {
    path: "/AddRoom",
    element: <AddRoom />,
  },
  {
    path: "/Property",
    element: <Property />,
  },
  {
    path: "/Partnerhome",
    element: <Partnerhome />,
  },
  {
    path: "/Probiemp",
    element: <Probiemp />,
  },
  {
    path: "/Usecoupon",
    element: <Usecoupon />,
  },
  {
    path: "/Booking",
    element: <Booking />,
  },
  {
    path: "/Bookingpartner",
    element: <Bookingpartner />,
  },
  {
    path: "/Bookingpartners",
    element: <Bookingpartners />,
  },
  {
    path: "/Expend",
    element: <Expend />,
  },
  {
    path: "/Gpshotel",
    element: <Gpshotel />,
  },
  {
    path: "/Mycoupon",
    element: <Mycoupon />,
  },
  {
    path: "/Bookingcard",
    element: <Bookingcard />,
  },
  {
    path: "/Bookingroomcard",
    element: <Bookingroomcard />,
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
    path: "/Famouspage",
    element: <Famouspage />,
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
