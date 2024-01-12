import React, { useState, useEffect } from 'react';
import './nav.css';
import { useUserAuth } from '../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logoImage from '../assets/logoapp.png';
import { Button, NavDropdown } from 'react-bootstrap'; 

import { collection, getDocs, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase'

function Nav() {
  const { logOut, user } = useUserAuth();
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = () => {
        if (!user) {
            setIsAuthenticated(false); 
        } else {
            setIsAuthenticated(true);
            fetchPost();  
        }
    };

    checkAuthStatus();
   }, [user, navigate]);

  const fetchPost = async () => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const profilesCollectionRef = collection(userDocRef, 'profiles');
    try {
        const querySnapshot = await getDocs(profilesCollectionRef);
        const userProfileData = [];

        querySnapshot.forEach((doc) => {
            userProfileData.push(doc.data());
        });
        setTodos(userProfileData);  
    } catch (err) {
        console.error("Error", err);
    }
}

  const handleProfile = async () => {
    try {
      navigate('/Bookinghistory');
    } catch (err) {
      console.log(err.message);
    }
  };

  const add = () => {
    navigate('/Property');
  }

  return (
    <nav className='menubar'>
      <Link className='logo' to='/'>
        <img src={logoImage} alt="Hame Logo" /> {/* ใส่รูปภาพที่คุณต้องการ */}
      </Link>
      <div>
        <Link className='manu' to='/'>
          หน้าแรก
        </Link>
        <Link className='manu' to='/Booking'>
          จองห้องพัก
        </Link>
        <Link className='manu' to='/Famous'>
          สถานที่แนะนำ
        </Link>
        <Link className='manu' to='/Community'>
          ชุมชน
        </Link>
        <Link className='manu' to='/Promotion'>
          โปรโมชั่น
        </Link>
        <Link className='manu' to='/Sightseeing'>
          รถรับส่ง
        </Link>
        {/* <Link className='manu' to='/Ex'>
          type
          </Link>
        <Link className='manu' to='/test'>
          ทดสอบ
        </Link> */}
      </div>
      <div className='menubar-log'>
        <div className="eenev">
              <button onClick={add} className="eenev-p" >ลงทะเบียนที่พัก</button>
        </div>
        {user?.email ? (
                <div className='box-nav-profile'>
                {todos?.map((todo, i) => (
                    <div className='profile-nav-container' key={i}>
                    <img src={todo.profile} className='profile-nav' />
                    <h6 onClick={handleProfile} className='name-manu-log'>{todo.name}</h6>
                    <NavDropdown className='manu'>
                      <NavDropdown.Item bsPrefix="nav-item" href='/Profile'>บัญชีของฉัน</NavDropdown.Item>
                      <NavDropdown.Item bsPrefix="nav-item" href='/Bookinghistory'>ประวัติการจอง</NavDropdown.Item>
                      <NavDropdown.Item bsPrefix="nav-item" href='/Mycoupon'>คูปองของฉัน</NavDropdown.Item>
                      <NavDropdown.Item bsPrefix="nav-item" href='/Reportproblem'>แจ้งปัญหา</NavDropdown.Item>
                      <NavDropdown.Item bsPrefix="nav-item" onClick={logOut}>
                        <button className="Out-Nav-P">ออกจากระบบ</button>
                      </NavDropdown.Item>
                    </NavDropdown>
                    </div>
                ))}
                </div>
        ) : (
          <div className="login-register-container">
            <Link className='manu login-button' to='/Login'>
              เข้าสู่ระบบ
            </Link>
            <Link className='manu register-button' to='/Register'>
              สมัครสมาชิก
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
