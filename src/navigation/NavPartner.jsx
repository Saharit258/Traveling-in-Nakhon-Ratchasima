import React from 'react'
import './NavProfile.css'
import { useUserAuth } from "../context/UserAuthContext";
import { Link, useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap';

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

  return (
    <nav className='menubar-partner'>
        <Link className='manu' to="/Home">แดชบอร์ด</Link>
        <Link className='manu' to="">การจอง</Link>
        <Link className='manu' to="/Hotel">ที่พัก</Link>
        <Link className='manu' to="/Room">ห้องพัก</Link>
        <Link className='manu' to="">รีวิว</Link>
        <div className='manu-log'>
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