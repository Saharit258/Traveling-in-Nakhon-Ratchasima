import React from 'react';
import './admincss/NavAdmin.css';
import { useUserAuth } from '../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Button, NavDropdown } from 'react-bootstrap'; 

function NavAdmin() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <nav className='menubar-df'>
      <Link className='manu' to='/HomeAdmin'>
        Dashboard
      </Link>

      <NavDropdown className='manu' title='ที่พัก'>
        <NavDropdown.Item href='/HotelAdmin'>ที่พักทั้งหมด</NavDropdown.Item>
        <NavDropdown.Item href='/Confirmhotel'>ที่พักรอการยืนยัน</NavDropdown.Item>
        <NavDropdown.Item href='/Hotelhistory'>ประวัติ</NavDropdown.Item>
      </NavDropdown>

      <NavDropdown className='manu' title='ผู้ใช้'>
        <NavDropdown.Item href='/UserAdmin'>ผู้ใช้ทั้งหมด</NavDropdown.Item>
        <NavDropdown.Item href='/ShowproblemAdmin'>ปัญหาจากผู้ใช้</NavDropdown.Item>
      </NavDropdown>

      <Link className='manu' to='/FamousAdmin'>
        สถานที่เที่ยว
      </Link>
      <Link className='manu' to='/CommunityAdmin'>
        ชุมชนแลกเปลี่ยน
      </Link>
      <Link className='manu' to='/CalendarAdmin'>
        ปฎิทิน
      </Link>
      <Link className='manu' to='/Promotion'>
        โปรโมชั่น
      </Link>
      <Link className='manu' to='/Sightseeing'>
        รถประจำทาง
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
  );
}

export default NavAdmin;
