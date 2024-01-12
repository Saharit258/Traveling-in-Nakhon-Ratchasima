import React, { useState, useEffect } from 'react';
import Nav from './NavAdmin';
import { collectionGroup, getDocs, query, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import Swal from 'sweetalert2';
import { useUserAuth } from '../context/UserAuthContext';
import './admincss/UserAdmin.css';

import { FiEye, FiUsers } from 'react-icons/fi';
import usersprofile from '../assets/men_22005.png';

function UserAdmin() {
  const { logOut, user } = useUserAuth();
  const [profiles, setProfiles] = useState([]);
  const [check, setCheck] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  const handleCheck = (profile) => {
    setCheck(profile);
  };

  const fetchProfiles = async () => {
    try {
      const querySnapshot = await getDocs(query(collectionGroup(firestore, 'profiles')));
      const arr = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      arr.sort((a, b) => a.usertype.localeCompare(b.usertype));
      setProfiles(arr);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Confirm Deletion',
      text: 'Are you sure you want to delete this profile?',
      icon: 'warning',
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(firestore, 'users', user.uid));
          const updatedProfiles = profiles.filter((profile) => profile.id !== id);
          setProfiles(updatedProfiles);
          Swal.fire({
            icon: 'success',
            title: 'Deleted',
            showConfirmButton: false,
          });
        } catch (err) {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete the profile',
          });
        }
      }
    });
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.usertype.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Nav />

      <div className="horizontal-user-container">
        <div className="horizontal-user">
          <div className="horizontal-user-box">
            <h3>ชื่อ: {check.name}</h3>
            <h3>อีเมล: {check.email}</h3>
            <h3>วันเกิด: {check.birthday}</h3>
            <h3>อายุ: {new Date().getFullYear() - new Date(check.birthday).getFullYear()}</h3>
          </div>
        </div>
        <div className="horizontal-user">
          <div className="horizontal-user-box">
            <h3>เพศ: {check.sex}</h3>
            <h3>เบอร์โทรศัพท์: {check.phonenumber}</h3>
            <h3>ที่อยู่: {check.address}</h3>
          </div>
        </div>
        <div className="horizontal-user">
          <div className="horizontal-user-box-img">
            {check.profile ? (
              <img className="horizontal-user-img" src={check.profile} alt="Profile" />
            ) : (
              <img className="horizontal-user-img" src={usersprofile} alt="Profile" />
            )}
            <h3>Type: {check.usertype}</h3>
          </div>
        </div>
      </div>

      <div className='Search-user'>
        <label htmlFor="search">Search : </label>
        <input
          type="text"
          id="search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Enter name or type..."
        />
      </div>

      <div className="horizontal-user1-container">
        <div className="horizontal-user1">
          <div className="horizontal-user1-box">
            <div style={{ width: '1300px', height: '500px', overflow: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>User Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id}>
                      <td>{profile.name}</td>
                      <td>{profile.email}</td>
                      <td>{profile.usertype}</td>
                      <td>
                        <button className="box-Promotion-button2" onClick={() => handleDelete(profile.id)}>
                          Delete
                        </button>
                        <button className="box-Promotion-button1" onClick={() => handleCheck(profile)}>
                          Check
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserAdmin;
