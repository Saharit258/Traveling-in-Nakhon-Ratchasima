import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { collection, addDoc, getDocs, doc } from 'firebase/firestore';
import { Form, Button } from 'react-bootstrap';
import Nav from '../navigation/Nav'
import Manuprofile from './manupage/manuprofile'
import '../pagecss/Bookinghistory.css'
import '../pagecss/Reportproblem.css'
import Swal from 'sweetalert2'
import NavProfile from '../navigation/NavProfile'
import { firestore } from '../database/firebase'

function Reportproblem() {
  const { logOut, user } = useUserAuth();
  const [todos, setTodos] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [problem, setProblem] = useState();
  const [problemsusubject, setProblemsusubject] = useState();
  

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
    const checkAuthStatus = async () => {
        if (!user) {
            setIsAuthenticated(false);
            navigate('/');
        } else {
            setIsAuthenticated(true);
            await fetchPost();
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

  const addProblems = async (e) => {
    e.preventDefault();

    try {
        const docRef = await addDoc(collection(firestore, "problems"),{
            email: user?.email,
            problem: problem,
            problemsusubject: problemsusubject,
            time: new Date().toLocaleString(),
        })
        console.log("Problem ID: ", docRef.id);
        alert("ส่งแล้ว");
    } catch(e){
        console.error("Error", e);
    }
  }

  return (
    <>
      <Nav />
        <div className="box-container-Problem">
            <div className="Problem-sidebar">
                <div className='profile-card-manu'>
                        <img src={todos[0]?.profile} className='profile-img-manu' alt='Profile' />
                        <p className='profile-name-profile-card-manu'>{todos[0]?.name}</p>
                    <hr></hr>
                        <Link className='manu-manu' to='/Profile'>บัญชีของฉัน</Link>
                        <Link className='manu-manu' to='/'>คูปองของฉัน</Link>
                        <Link className='manu-manu' to='/Reportproblem'>แจ้งปัญหา</Link>
                    <hr></hr>
                        <button onClick={Logout}>ออกจากระบบ</button>
                </div>
            </div>
            <div className="Problem-product">
            <div className="problem-box-card">
                    <h2 className="problem-taxt">แจ้งปัญหา</h2>
                    <Form onSubmit={addProblems}>
                                <Form.Group className="mb-3" controlId='formBasicName'>
                                    <Form.Control
                                        type='text'
                                        placeholder='เรื่อง'
                                        onChange={(e) => setProblem(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId='formBasicEmail'>
                                    <Form.Control
                                        as="textarea"
                                        rows={8}
                                        placeholder='รายระเอียด'
                                        onChange={(e) => setProblemsusubject(e.target.value)}
                                    />
                                </Form.Group>

                                <div className="d-grid gap-2">
                                    <Button variant="primary" type="submit">แจ้ง</Button>
                                </div>
                            </Form>
                    </div>
            </div>
        </div>

    </>
  );
}

export default Reportproblem;