import React, { useState, useEffect, useRef } from 'react';
import Nav from '../navigation/Nav';
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';

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
      <div className='box-Promotion'>
        <div className="box-Promotion-layer">
          <div className="layer1">
            <div className="layer1-box">โปรโมชันและสิทธิพิเศษ</div>
          </div>
          <div className="layer2">
            <div className="layer1-box">โปรโมชันและสิทธิพิเศษ</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Promotion;
