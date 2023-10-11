import React from 'react'
import './nav.css'
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
        <nav className='menubar'>
        <Link className='manu' to='/'>
            Hame
        </Link>
        <Link className='manu' to='/Booking'>
            Booking
        </Link>
        {/* <Link className='manu' to="/Todo">Todo</Link> */}
        <Link className='manu' to='/Famous'>
            Famous
        </Link>
        <Link className='manu' to='/Community'>
            Community
        </Link>
        <Link className='manu' to='/Profile'>
            Profile
        </Link>
        <div className='manu-log'>
            {user?.email ? (
            <>
                <a className='manu-a' onClick={handleLogout}>
                {user.email}
                </a>
            </>
            ) : (
            <>
                <Link className='manu' to='/Login'>
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