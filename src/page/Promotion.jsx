import React, { useState, useEffect, useRef } from 'react';
import Nav from '../navigation/Nav';
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Promotion.css'
import { Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';


function Promotion() {
  const { user } = useUserAuth();
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
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

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'promotions'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDataFromFirestore(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  return (
    <>
      <Nav />
      
      
      <div>

       <div className="card">
          <h2>โปรโมชันและสิทธิพิเศษ</h2>
        </div>

        <div className="box-container-promotion">
            <div className="promotion-sidebar">
              <h2>โปรโมชั่นต่างๆ</h2>

              <div>
                  <label>
                    <input
                      type="radio"
                      value="คูปองส่วนลด"
                    />
                    คูปองส่วนลด
                  </label>
              </div>

              <div>
                  <label>
                    <input
                      type="radio"
                      value="แคมเปญพิเศษ"
                    />
                    แคมเปญพิเศษ
                  </label>
              </div>

              </div>

            <div className="promotion-product">

              {dataFromFirestore.map((item, i) => (

                    <div className="promotion-item" key={i}>
                    <img src={item.image} className="img-promotion" alt="" />
                    <p>{item.about}</p>
                    <Button className='button-promotion'>รับส่วนลด</Button>
                    </div>

              ))}


            </div>
          </div>
        </div>
      
    </>
  )
}

export default Promotion;
