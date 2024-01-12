import React from 'react'
import './NavProfile.css'
import { useUserAuth } from "../context/UserAuthContext";
import { Link, useNavigate } from 'react-router-dom'
import logoImage from '../assets/logoapp.png';
import { Button } from 'react-bootstrap';

import { FaBell } from "react-icons/fa6";

function Nav() {

    const { logOut, user } = useUserAuth();

    console.log(user);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try{
            await logOut();
            navigate('/');
        } catch (err) {
            console.log(err.message);
        }
    }

    const handleAddButtonClick = () => {
        navigate("/Probiemp");
      };

  return (
    <nav className='menubar'>
     <Link className='logo' to='/Partnerhome'>
        <img src={logoImage} alt="Hame Logo" /> 
      </Link>
      <div>
        <Link className='manu' to="/Partnerhome">แดชบอร์ด</Link>
        <Link className='manu' to="/Bookingpartner">การจอง</Link>
        <Link className='manu' to="/Hotel">ที่พัก</Link>
        <Link className='manu' to="/Roomadd">ห้องพัก</Link>
        <Link className='manu' to="">รีวิว</Link>
        </div>
        <div className='manu-log'>
          <FaBell onClick={handleAddButtonClick} className='manu-icon'/>
            {user?.email ? (
            <>
                <a className='manu-a' onClick={handleLogout}>
                {user.email}
                </a>
            </>
            ) : (
            <>
                <Link className='manu' to='/'>
                Login
                </Link>
                <Link className='manu' to='/Register'>
                Register
                </Link>
            </>
            )}
        </div>
    </nav>
  )
}

export default Nav