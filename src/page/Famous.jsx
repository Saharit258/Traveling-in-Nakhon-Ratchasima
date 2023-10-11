import React, { useState, useEffect } from 'react';
import Nav from '../navigation/Nav';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Famous.css';

function Famous() {
  const [famous, setFamous] = useState([]);

  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'famous'));
      const newData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setFamous(newData);
      console.log('Data', famous, newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <Nav />
      <div className='box-Famous'>
        <div>
        <div className='box-Famous-rox'>
            {famous?.map((todo, i) => (
                <div key={i} className='Famous-card'>
                <img className='Famous-photo' src={todo.photo} alt="Avatar" />
                <h3 className='Famous-h3'>{todo.name}</h3>
                <p className='Famous-a'>ที่อยู่: <a href={todo.map}>{todo.add}</a></p>
                </div>
            ))}
            </div>
        </div>
      </div>
    </>
  );
}

export default Famous;
