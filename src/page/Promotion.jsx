import React, { useState, useEffect, useRef } from 'react';
import Nav from '../navigation/Nav';
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Promotion.css'

function Promotion() {
  const [profiles, setProfiles] = useState([]);
  
  const fetchProfiles = async () => {
    let arr = [];

    const querySnapshot = await getDocs(query(collectionGroup(firestore, "profiles")));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());  
    });
    setProfiles(arr);
    arr = [];

    // console.log(profiles);
  } // end fetchProfiles

  useEffect(() => {
    fetchProfiles();
  }, []);

  return (
    <>
      <Nav />
      
      
      <div className="card">
          <h2>โปรโมชันและสิทธิพิเศษ</h2>
        </div>
        
      <div className='card-container'>
        <div className='cards'>
          <div className='image'> </div>
          <div className='taitle'> <p>คูปองส่วนลด</p> </div>
          <div className='des'>
            <button>รับคูปอง</button> 
          </div>
        </div>

        <div className='cards'>
          <div className='image'> </div>
          <div className='taitle'> <p>คูปองส่วนลด</p> </div>
          <div className='des'>
            <button>รับคูปอง</button> 
          </div>
        </div>

        <div className='cards'>
          <div className='image'> </div>
          <div className='taitle'> <p>คูปองส่วนลด</p> </div>
          <div className='des'>
            <button>รับคูปอง</button> 
          </div>
        </div>  

      </div>
      
    </>
  )
}

export default Promotion;
