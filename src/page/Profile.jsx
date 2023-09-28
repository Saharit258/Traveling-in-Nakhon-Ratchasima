import React, { useState, useEffect} from 'react'
import Nav from '../navigation/Nav'
import { collection, addDoc, getDocs, QuerySnapshot, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase'

import { auth } from '../database/firebase';

function Profile() {

  const [todos, setTodos] = useState([]);
  const [userData, setUserData] = useState([]);
  const [userProfile, setUserProfile] = useState([]);

  const storageKey = 'users';

  function encodeData(data) {
      const jsonData = JSON.stringify(data);
      return btoa(jsonData);
  }

  function decodeData(encodedData) {
    const jsonData = atob(encodedData);
    return JSON.parse(jsonData);
  }

  function getAuthStatus() {
    const encodedData = localStorage.getItem(storageKey);
    if (encodedData) {
        const decodedData = decodeData(encodedData);
        if (decodedData && decodedData.user) {
            return decodedData.user; // return user data with decoded data
        }
    }
    return null; // if not found user
  }

  useEffect(() => {
    const user = getAuthStatus();
    setUserData(user); // เพิ่มการตั้งค่าข้อมูลผู้ใช้ใน state ใหม่
  }, [auth]);

  const fetchPost = async () => {
    const userDocRef = doc(database, 'users', this.uid);
    const profilesCollectionRef = collection(userDocRef, 'profiles');
      try{
        const querySnapshot = await getDocs(profilesCollectionRef);
        const userProfileData = [];
    
        querySnapshot.forEach((doc) => {
          userProfileData.push(doc.data());
        });
    
        // บันทึกข้อมูลใน Session Storage
        sessionStorage.setItem('userProfile', JSON.stringify(userProfileData));
    
        return userProfileData;
      }catch (err) {
        setError(err.message);
        console.error("Error", err);
    }
  }

    useEffect(() => {
        fetchPost();
    }, []);

    useEffect(() => {
      if (userData && userData.uid) {
  
        console.log('User UID:', userData.uid);
        getProfile(userData.uid)
      }
    }, [userData]);
  
    const getProfile = async (uid) => {
      const Uprofile = new fetchPost(uid);
      const userProfile = await Uprofile.getProfile()
      setUserProfile(userProfile)
    }
  
    console.log(userProfile)

  return (
    <>
    <Nav/>
    <div>Profile
    <div className='flex flex-row align-middle gap-2'>
                  <p className='profile-name'>{userProfile[0].Name}</p>
                  <img src={userProfile[0].Profile} alt={userProfile[0].Name} className='profile-img' />
                </div>
    </div>
    </>
  )
}

export default Profile