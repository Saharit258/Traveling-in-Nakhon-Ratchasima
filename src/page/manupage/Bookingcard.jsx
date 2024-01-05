import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from "../../context/UserAuthContext";
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav'

function Bookingcard() {
    const uid = new URLSearchParams(location.search).get('uid');
    const [dataFromFirestore, setDataFromFirestore] = useState([]);


    const fetchPost = async () => {
        try {
          const docRef = doc(firestore, 'hotels', uid);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            const fetchedData = { id: docSnap.id, ...docSnap.data() };
            setDataFromFirestore([fetchedData]);
          } else {
            console.log('Document not found.', uid);
            setDataFromFirestore([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };
    
      useEffect(() => {
        fetchPost();
      }, []);

  return (
    <>
    <Nav/>
      {dataFromFirestore.map((item) => (
        <div>{item.pname}</div>
      ))}
    </>
  )
}

export default Bookingcard