import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav'
import '../pagecss/Profile.css'
import Swal from 'sweetalert2'
import NavProfile from '../navigation/NavProfile'

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase'

function Profile() {
  const { logOut, user } = useUserAuth();
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editid, setEditId] = useState(null);
  const [form, setForm] = useState({})

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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:e.target.value
    })
  }

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
          setTodos(userProfileData);  // กำหนดข้อมูลให้กับ state
      } catch (err) {
          console.error("Error", err);
      }
  }

  const handleSave = async () => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const profilesCollectionRef = collection(userDocRef, 'profiles');
    try {
      // Corrected: Pass the correct document reference and the defined 'form' variable to updateDoc.
      await updateDoc(doc(profilesCollectionRef, user.uid), form);
      setEditId(null);
          Swal.fire({
            title: 'กำลังทำการบันทึกข้อมูล',
            html: 'I will close in <b></b> milliseconds.',
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
            }
          })
          fetchPost();
    } catch (err) {
      console.log("Error:", err);
    }
  }

  return (
    <>
      <Nav />
      <div className='profile-container'>
          <div className='profile-card'>
            <img src={todos[0]?.profile} className='profile-img' alt='Profile' />
            <p className='profile-name-profile-card'>{todos[0]?.name}</p>
            <hr></hr>
            <Link className='manu' to='/Profile'>บัญชีของฉัน</Link>
            <Link className='manu' to='/'>คูปองของฉัน</Link>
            <Link className='manu' to='/Reportproblem'>แจ้งปัญหา</Link>
            <hr></hr>
            <button onClick={Logout}>ออกจากระบบ</button>
          </div>
          <div className="data-card">
                {todos?.map((todo, i) => (
                  <div className="card-profile" key={i}>
                    <div className="card-profile-name">

                      <p className="profile-email">ชื่อ: {editid === user.uid
                        ?(<>
                          <input
                            onChange={(e) => handleChange(e)}
                            type="text"
                            name="name"
                            value={form.name !== undefined ? form.name : todo.name}
                            placeholder="name"
                            />
                        </>)
                        :(todo.name)
                      }</p>

                      <p className="profile-name">อีเมล: {editid === user.uid
                        ?(<>
                          <input
                            onChange={(e) => handleChange(e)}
                            type="text"
                            name="email"
                            value={form.email !== undefined ? form.email : todo.email}
                            placeholder="email"
                            />
                        </>)
                        :(todo.email)
                      }</p>

                      <p className="profile-birthday">วันเดือนปีเกิด: {editid === user.uid
                        ?(<>
                          <input
                            onChange={(e) => handleChange(e)}
                            type="text"
                            name="birthday"
                            value={form.birthday !== undefined ? form.birthday : todo.birthday}
                            placeholder="birthday"
                            />
                        </>)
                        :(todo.birthday)
                      }</p>

                      <p className="profile-phonenumber">เบอร์โทร: {editid === user.uid
                        ?(<>
                          <input
                            onChange={(e) => handleChange(e)}
                            type="text"
                            name="phonenumber"
                            value={form.phonenumber !== undefined ? form.phonenumber : todo.phonenumber}
                            placeholder="phonenumber"
                            />
                        </>)
                        :(todo.phonenumber)
                      }</p>

                      <p className="profile-address">ที่อยู่: {editid === user.uid
                        ?(<>
                          <input
                            onChange={(e) => handleChange(e)}
                            type="text"
                            name="address"
                            value={form.address !== undefined ? form.address : todo.address}
                            placeholder="address"
                            />
                        </>)
                        :(todo.address)
                      }</p>

                    </div>
                    <div className="card-profile-proto">
                      <img src={todos[0]?.profile} className="card-profile-img" alt="profile" />
                        { editid === user.uid
                          ?(<>                      
                          <p >รูป: {editid === user.uid
                            ?(<>
                              <input
                                onChange={(e) => handleChange(e)}
                                type="text"
                                name="profile"
                                value={form.profile !== undefined ? form.profile : todo.profile}
                                placeholder="profile"
                                />
                            </>)
                            :(todo.profile)
                          }</p></>)
                          :(null)
                        }
                      {editid === user.uid 
                        ?(<>
                          <button className="card-profile-edit" onClick={() => handleSave(user.uid)}>ตกลง</button>
                        </>)
                        :(<button className="card-profile-edit" onClick={() => setEditId(user.uid)}>แก้ไข</button>)
                      }
                    </div>
                  </div>
                ))}
              </div>
        </div>
    </>
  );
}

export default Profile;