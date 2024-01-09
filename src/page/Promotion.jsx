import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, collectionGroup, setDoc, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Promotion.css';
import { Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import Nav from '../navigation/Nav';

function Promotion() {
  const { user } = useUserAuth();
  const [dataFromFirestore, setDataFromFirestore] = useState([]);

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

  const datasubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        about: dataFromFirestore[0]?.about ,
        discount: dataFromFirestore[0]?.discount ,
        image: dataFromFirestore[0]?.image ,
        promotionname: dataFromFirestore[0]?.promptionname ,
        starttime: dataFromFirestore[0]?.starttime ,
        endtime: dataFromFirestore[0]?.endtime ,
        uid: user.uid,
        type: "พร้อมใช้งาน" 
      }
      const userBookingCollectionRef = collection(firestore, 'users', user.uid ,'coupon');
      const userProfileDocRef = doc(userBookingCollectionRef , user.uid);

      await setDoc(userProfileDocRef, userData);

      alert (userProfileDocRef);
    }catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <Nav />
      <div>
        <div className="card-pro">
          <h2>โปรโมชันและสิทธิพิเศษ</h2>
        </div>
        <div className="box-container-promotion">
          <div className="promotion-sidebar">
            <h2>โปรโมชั่นต่างๆ</h2>
            <div>
              <label>
                <input type="radio" value="คูปองส่วนลด" />
                คูปองส่วนลด
              </label>
            </div>
            <div>
              <label>
                <input type="radio" value="แคมเปญพิเศษ" />
                แคมเปญพิเศษ
              </label>
            </div>
          </div>
          <div className="promotion-product">
            {dataFromFirestore.map((item, i) => (
              <div className="promotion-item" key={i}>
                <img src={item.image} className="img-promotion" alt="" />
                <p>{item.about}</p>
                <button onClick={(e) => datasubmit(e)} className="button-promotion">
                  รับส่วนลด
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Promotion;
