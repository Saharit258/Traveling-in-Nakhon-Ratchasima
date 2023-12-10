import React, { useState, useEffect, useRef } from 'react';
import Nav from '../navigation/Nav';
import { collection, collectionGroup, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Promotion.css'
import { Button } from 'react-bootstrap';


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

              <div className="promotion-item">
                <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                <p>Promotion</p>
                <Button className='button-promotion'>รับส่วนลด</Button>
              </div>

              <div className="promotion-item">
                <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                <p>Promotion</p>
                <Button className='button-promotion'>รับส่วนลด</Button>
              </div>

              <div className="promotion-item">
                <img src="https://f.ptcdn.info/777/054/000/ozrtiimdpKy4FUGapyR-o.jpg" className="img-promotion" alt="" />
                <p>Promotion</p>
                <Button className='button-promotion'>รับส่วนลด</Button>
              </div>

            </div>
          </div>
        </div>
      
    </>
  )
}

export default Promotion;
