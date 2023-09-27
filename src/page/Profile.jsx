import React, { useState, useEffect } from 'react';
import Nav from '../navigation/Nav';
import { collection, getDocs, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase';

function Profile() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const userDocRef = doc(firestore, 'users', 'YOUR_USER_UID'); // แทน 'YOUR_USER_UID' ด้วย UID ของผู้ใช้ของคุณ
    const profilesCollectionRef = collection(userDocRef, 'profiles'); // อ้างอิงไปยังคอลเลกชัน "profiles" ในเอกสารผู้ใช้

    try {
      const querySnapshot = await getDocs(profilesCollectionRef);
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setTodos(newData);
      console.log("Data",newData);
    } catch (err) {
      setError(err.message);
      console.error("Error", err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <>
      <Nav />
      <div>
        <h1>Profile</h1>
        <div>
          {error && <p>Error: {error}</p>}
          {todos.map((todo, i) => (
            <p key={i}>{todo.Name}</p>
          ))}
        </div>
      </div>
    </>
  );
}

export default Profile;
