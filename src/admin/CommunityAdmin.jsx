import React, { useState, useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import Nav from './NavAdmin';
import { Form, Alert, Button } from 'react-bootstrap';
import './admincss/CommunityAdmin.css';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';
import { Modal } from 'react-bootstrap';

function CommunityAdmin() {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [community, setCommunity] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState([]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'communitys', id));
      const updatedCommunity = community.filter(item => item.id !== id);
      setCommunity(updatedCommunity);
      Swal.fire({
        icon: 'success',
        title: 'ลบ',
        showConfirmButton: false,
      })  
    } catch (err) {
      console.log(err);
    }
  };

  const AddcommunityPage = () => {
    if (!user) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'คุณยังไม่ได้ลงทะเบียน',
      });
      navigate('/Login');
    } else {
      navigate('/Addcommunity');
    }
  };

  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'communitys'));
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      const sortedData = newData.sort((a, b) => new Date(b.time) - new Date(a.time));

      console.log("Data: ", sortedData);
      setCommunity(sortedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false); 
    }
  };

  const fetchPPost = async () => {
    const profilePromises = community.map(async (todo) => {
      const userProfilesQuery = query(collection(firestore, "users", todo.uid, "profiles"));
      const querySnapshot = await getDocs(userProfilesQuery);
      const userProfiles = [];

      querySnapshot.forEach((doc) => {
        userProfiles.push(doc.data());
      });

      return userProfiles;
    });

    const profilesForAllPosts = await Promise.all(profilePromises);
    setProfiles(profilesForAllPosts);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    fetchPPost();
  }, [community]);

  const fetchPosts = async () => {
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

  useEffect(() => {
    fetchPosts();
  }, []);


  return (
    <>
      <Nav />

      <div className="card-Community">
          <h2>ชุมชนแลกเปลี่ยนความสนุก</h2>
        </div>

        <div className="box-container-famous">

         <div className="community-sidebar">
            {todos?.map((todo, x) => (
              <div className="foo">
              <img src={todo.profile}  className="card-community-profile-img" alt="profile" />
              <h4 className='community-name-profile'>{todo.name}</h4>
              </div>
            ))}
            <Button className='community-button-add-1' onClick={AddcommunityPage}>โพสต์</Button>
          </div>


          <div className="Community-product">
            {isLoading && <p className='loading-famous' ><div class="spinner-border" role="status">
                            <span class="sr-only"></span>
                          </div></p>}

               {!isLoading && ( <div className='community-rox'>
                      <div className='box-community'>
                        <div>
                          {community?.map((todo, i) => (
                            <div key={i} className='community-card'>
                              {profiles[i]?.map((profile, j) => (
                                <img key={j} src={profile.profile} className='profile-imgg' />
                              ))}
                              {profiles[i]?.map((profile, j) => (
                                <h3 key={j} className='community-email'>{profile.name}</h3>
                              ))}
                              <p className='community-time'>{todo?.time}</p>
                              <button className="delete-button" onClick={() => handleDelete(todo.id)}>Delete</button>
                              <hr></hr>
                              <p className='community-subject'>{todo.subject}</p>
                              {todo.mapaddcom && (
                                <a className='community-subject' href={todo.mapaddcom}>{todo.mapaddcom}</a>
                              )}
                              <img className='community-photo' src={todo.photo} />
                              {todo.vdo && (
                                <iframe className='community-vdo' src={todo.vdo} title="Community Video"></iframe>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

      )}
          </div>
        </div>
    </>
  )
}

export default CommunityAdmin;
