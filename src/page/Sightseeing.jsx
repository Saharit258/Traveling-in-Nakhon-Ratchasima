import React, { useState, useEffect } from 'react'
import Nav from '../navigation/Nav'
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Sightseeing.css'

function Sightseeing() {
    const [famous, setFamous] = useState([]);

    const fetchPost = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'Sightseeings'));
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
    < Nav />
    <div className='Sightseeing'>
    <div className='box-Sightseeing'>
        <div>
        <div className='box-Sightseeing-rox'>
            {famous?.map((todo, i) => (
                <div key={i} className='Sightseeing-card'>
                <h3 className='Sightseeing-h3'>{todo.Timetable}</h3>
                <p className='Sightseeing-a'>จุดจอดรถ: {todo.parkingspot} [ <a href={todo.map}>map</a> ]</p>
                <p className='Sightseeing-a'>เส้นทาง: {todo.Route} </p>
                <p className='Sightseeing-a'>เบอร์โทร: {todo.Phonenumber} </p>
                <p className='Sightseeing-a'>เวลา: {todo.Time} <p className='Sightseeing-a'>{todo.Price}</p> </p>
                <p className='Sightseeing-a'>หมายเหตุ: {todo.note} </p>
                </div>
            ))}
            </div>
        </div>
      </div>
      </div>
    </>
  )
}

export default Sightseeing