import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav'
import Manuprofile from './manupage/manuprofile'
import '../pagecss/Bookinghistory.css'
import Swal from 'sweetalert2'
import NavProfile from '../navigation/NavProfile'

import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase'

function Bookinghistory() {
  const { logOut, user } = useUserAuth();
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [booking, setBooking] = useState([]);
  const [dataFromFirestoreshotel, setDataFromFirestoreshotel] = useState([]);
  const [roomss, setRooms] = useState([]);

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
              navigate('/');  
          } else {
              // ถ้าเข้าสู่ระบบแล้ว
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

  const fetchPosthotels = async () => {
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const bookingsCollectionRef = collection(userDocRef, 'bookings');
      
      const querySnapshot = await getDocs(bookingsCollectionRef);
      const bookingData = [];
  
      querySnapshot.forEach((doc) => {
        bookingData.push({ id: doc.id, ...doc.data() });
      });
  
      setBooking(bookingData);
    } catch (error) {
      console.error('Error fetching booking data:', error.message);
    }
  };
  
  useEffect(() => {
    fetchPosthotels();
  }, [user]);
  

  const fetchPosthotel = async () => {
    try {
        const docRef = doc(firestore, 'hotels', booking[0]?.huid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const fetchedData = { id: docSnap.id, ...docSnap.data() };
            setDataFromFirestoreshotel([fetchedData]);
        } else {
            console.log('Document not found.', uid);
            setDataFromFirestoreshotel([]);
        }
    } catch (error) {
        console.error('Error fetching post data:', error.message);
    }
};

useEffect(() => {
  fetchPosthotel();
}, [booking]);

const handleAddButtonClick = (id) => {
  navigate(`/Expend?uid=${id}`);
};



  return (
    <>
      <Nav />
        <div className="box-container-History">
          <div className="History-sidebar">
            {todos.map((item) => (
                            <div className='profile-card-manu'>
                            <img src={item.profile} className='profile-img-manu' alt='Profile' />
                            <p className='profile-name-profile-card-manu'>{item.name}</p>
                        <hr></hr>
                            <Link className='manu-manu' to='/Profile'>บัญชีของฉัน</Link>
                            <Link className='manu-manu' to='/Bookinghistory'>ประวัติการจอง</Link>
                            <Link className='manu-manu' to='/Mycoupon'>คูปองของฉัน</Link>
                            <Link className='manu-manu' to='/Reportproblem'>แจ้งปัญหา</Link>
                        <hr></hr>
                            <button onClick={Logout}>ออกจากระบบ</button>
                    </div>
            ))}
          </div>
          <div className="History-product">
          <h2 className="hostory-taxt">ประวัติการจองของฉัน</h2>
          <div className="historyprofile-bar"> 
              <div className="bookinghistory-box">
                {booking.map((item, i) => (
                  <div className="history-card" key={i} onClick={() => handleAddButtonClick(item.id)}>
                    <h2>{dataFromFirestoreshotel[0]?.pname}</h2>
                    <h5>ห้องเลขที่: {item.roomno}</h5>
                    <h5>ชื่อ: {item.name}</h5>
                    <h5>วันที่เข้า: {item.checkInDate}</h5>
                    <h5>วันที่ออก: {item.checkOutDate}</h5>
                    <h5>ราคา: {item.totalPrice}</h5>
                    <h5>สภานะ: {item.pay}</h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </div>
    </>
  );
}

export default Bookinghistory;