import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav';
import Manuprofile from './manupage/manuprofile';
import '../pagecss/Mycoupon.css'
import Swal from 'sweetalert2';
import { v4 } from "uuid"; 
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import NavProfile from '../navigation/NavProfile';

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../database/firebase';

function Mycoupon() {
    const { logOut, user } = useUserAuth();
    const [todos, setTodos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
    const navigate = useNavigate();

    const Logout = async () => {
        try {
            await logOut();
            Swal.fire({
              icon: 'success',
              title: 'ออกจากระบบ',
              showConfirmButton: false,
            })  
            navigate('/');
        } catch (err) {
          console.log(err.message);
        }
      };
    
      useEffect(() => {
          const checkAuthStatus = () => {
              if (!user) {
                  // ถ้ายังไม่ได้เข้าสู่ระบบ
                  setIsAuthenticated(false);
                  navigate('/');  // หรือไปที่หน้า login ตามที่คุณต้องการ
              } else {
                  // ถ้าเข้าสู่ระบบแล้ว
                  setIsAuthenticated(true);
                  fetchPost();  // เมื่อมีการเข้าสู่ระบบแล้วให้ดึงข้อมูล
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


    return (
        <>
          <Nav />
            <div className="box-container-Coupon">
              <div className="Coupon-sidebar">
                  <div className='profile-card-manu'>
                          <img src={todos[0]?.profile} className='profile-img-manu' alt='Profile' />
                          <p className='profile-name-profile-card-manu'>{todos[0]?.name}</p>
                      <hr></hr>
                          <Link className='manu-manu' to='/Profile'>บัญชีของฉัน</Link>
                          <Link className='manu-manu' to='/Mycoupon'>คูปองของฉัน</Link>
                          <Link className='manu-manu' to='/Reportproblem'>แจ้งปัญหา</Link>
                      <hr></hr>
                          <button onClick={Logout}>ออกจากระบบ</button>
                  </div>
              </div>
          </div>
        </>
      );


}

export default Mycoupon;