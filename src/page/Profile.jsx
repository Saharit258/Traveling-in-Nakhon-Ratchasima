import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav';
import Manuprofile from './manupage/manuprofile';
import '../pagecss/Profile.css';
import Swal from 'sweetalert2';
import { v4 } from "uuid"; 
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import NavProfile from '../navigation/NavProfile';

import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../database/firebase';

function Profile() {
  const { logOut, user } = useUserAuth();
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editid, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [img, setImg] = useState('');
  let timerInterval;

  const navigate = useNavigate();

  const Logout = async () => {
    try {
      await logOut();
      Swal.fire({
        icon: 'success',
        title: 'ออกจากระบบ',
        showConfirmButton: false,
      });
      navigate('/');
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const checkAuthStatus = () => {
      if (!user) {
        setIsAuthenticated(false);
        navigate('/');
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
  };

  const handleSave = async () => {
    const userDocRef = doc(firestore, 'users', user.uid);
    const profilesCollectionRef = collection(userDocRef, 'profiles');
    try {
      await updateDoc(doc(profilesCollectionRef, user.uid), form);
      setEditId(null);
      Swal.fire({
        title: 'กำลังทำการบันทึกข้อมูล',
        html: 'I will close in <b></b> milliseconds.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getHtmlContainer().querySelector('b');
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft();
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('I was closed by the timer');
        }
      });
      window.location.reload();
    } catch (err) {
      console.log("Error:", err);
    }
  };

  const handleUplosd = (e) =>{
    console.log(e.target.files[0])
    const file = e.target.files[0];
    const imgs = ref(storage, `Imgs/${v4()}`);
    uploadBytes(imgs, file).then(data => {
      console.log(data, "imgs");
      getDownloadURL(data.ref).then(val => {
        setImg(val);
        setForm({
          ...form,
          profile: val,
        });
      });
    });
  };

  return (
    <>
      <Nav />
<<<<<<< Updated upstream
      <Manuprofile />

      <div className="profile-container-card">
        <div className="profile-container-card-bar">
          {todos?.map((todo, i) => (
            <div className="card-profile" key={i}>
              <div className="card-profile-name">
                <p className="profile-email">ชื่อ: {editid === user.uid
                  ? (<>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="name"
                      value={form.name ?? todo.name}
                      placeholder="name"
                    />
                  </>)
                  : (todo.name)
                }</p>

                <p className="profile-name">อีเมล: {editid === user.uid
                  ? (<>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="email"
                      value={form.email ?? todo.email}
                      placeholder="email"
                    />
                  </>)
                  : (todo.email)
                }</p>

                <p className="profile-address">เพศ: {editid === user.uid
                  ? (<>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="sex"
                      value={form.sex ?? todo.sex}
                      placeholder="sex"
                    />
                  </>)
                  : (todo.sex)
                }</p>

                <p className="profile-address">อายุ: {new Date().getFullYear() - new Date(todo.birthday).getFullYear()}</p>

                <p className="profile-birthday">วันเดือนปีเกิด: {editid === user.uid
                  ? (<>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="date"
                      name="birthday"
                      value={form.birthday ?? todo.birthday}
                      placeholder="birthday"
                    />
                  </>)
                  : (todo.birthday)
                }</p>

                <p className="profile-phonenumber">เบอร์โทร: {editid === user.uid
                  ? (<>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="phonenumber"
                      value={form.phonenumber ?? todo.phonenumber}
                      placeholder="phonenumber"
                    />
                  </>)
                  : (todo.phonenumber)
                }</p>

                <p className="profile-address">ที่อยู่: {editid === user.uid
                  ? (<>
                    <input
                      onChange={(e) => handleChange(e)}
                      type="text"
                      name="address"
                      value={form.address ?? todo.address}
                      placeholder="address"
                    />
                  </>)
                  : (todo.address)
                }</p>
              </div>
              <div className="card-profile-proto">
                <img src={todos[0]?.profile}  className="card-profile-img" alt="profile" />
                {editid === user.uid
                  ? (<>
                    <p>รูป: {editid === user.uid
                      ? (<>
                        <input
                          onChange={(e) => handleChange(e)}
                          type="text"
                          name="profile"
                          className="card-profile-edit-img"
                          value={img ?? form.profile ?? todo.profile}
                          placeholder="profile"
                        />
                       <input type="file" className="card-profile-img-input" onChange={(e)=>handleUplosd(e)}/>
                      </>)
                      : (todo.profile)
                    }</p></>)
                  : (null)
                }
                {editid === user.uid
                  ? (<>
                    <button className="card-profile-edit" onClick={() => handleSave(user.uid)}>ตกลง</button>
                    <button className="card-profile-end" >ยกเลิก</button>
                  </>)
                  : (<button className="card-profile-edit-to" onClick={() => setEditId(user.uid)}>แก้ไข</button>)
                }
              </div>
=======
      
      <div className="box-container-Profile">
        <div className="Profile-sidebar">
            <div className='profile-card-manu'>
                    <img src={todos[0]?.profile} className='profile-img-manu' alt='Profile' />
                    <p className='profile-name-profile-card-manu'>{todos[0]?.name}</p>
                <hr></hr>
                    <Link className='manu-manu' to='/Profile'>บัญชีของฉัน</Link>
                    <Link className='manu-manu' to='/Mycoupon'>คูปองของฉัน</Link>
                    <Link className='manu-manu' to='/Reportproblem'>แจ้งปัญหา</Link>
                <hr></hr>
                    <button onClick={Logout}>ออกจากระบบ</button>
>>>>>>> Stashed changes
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
