import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from "../../context/UserAuthContext";
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav'
import "../../pagecss/Famouspage.css"

function Famouspage() {
    const location = useLocation();
    const navigate = useNavigate();
    const uid = new URLSearchParams(location.search).get('uid');
    const [dataFromFirestore, setDataFromFirestore] = useState([]);
    const [showFullImage, setShowFullImage] = useState(false);
    const [fullImageUrl, setFullImageUrl] = useState('');

    const fetchPost = async () => {
        try {
          const docRef = doc(firestore, 'famouss', uid);
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

    const handleImageClick = (imageUrl) => {
        setFullImageUrl(imageUrl);
        setShowFullImage(true);
    };
    
    const closeFullImage = () => {
        setShowFullImage(false);
    };

    const isStoreOpen = (startTime, closingTime) => {
        if (startTime && closingTime) {
          const currentDate = new Date();
          const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();
    
          const [startHour, startMinute] = startTime.split(':').map(Number);
          const [closingHour, closingMinute] = closingTime.split(':').map(Number);
    
          const storeStartTime = startHour * 60 + startMinute;
          const storeClosingTime = closingHour * 60 + closingMinute;
    
          return currentTime >= storeStartTime && currentTime <= storeClosingTime;
        }
        return false;
      };


  return (
    <>
    <Nav/>
    {dataFromFirestore.map((item, i) => (
        <div key={i}>
            <div className="image-container-fpage">
                {item.imgUrls.map((img, imgIndex) => (
                    <img
                        key={imgIndex}
                        src={img}
                        alt=""
                        className="item-image-fpage"
                        onClick={() => handleImageClick(img)}
                    />
                ))}
             </div>
            <div className='box-container-fpage'>
            <div className="fpage-sidebar">
                <h1 className="box-fpage-left-1-h1">{item.name}</h1>
                <span className="box-item-bar-txt-1-p-p-fpage">{item.add} ตำบล{item.district} อำเภอ{item.districts} {item.codezo}</span>
            </div>
            <div className="fpage-product">
                <h4 className="box-fpage-left-1">เวลาเปิดปิดร้าน</h4>
                <div className="lf-c">
                    <div className="lf">
                      <p className='time-fpage'>{item.time} - {item.closingTime}</p>
                    </div>
                    <div className="rf">
                      <span className={`box-item-bar-txt-1-p-p-fpage ${isStoreOpen(item.time, item.closingTime) ? 'open' : 'closed'}`}>
                                {isStoreOpen(item.time, item.closingTime) ? ' (เปิดอยู่)' : ' (ปิดแล้ว)'}
                              </span>
                    </div>
                </div>
                <h4 className="box-fpage-left-1">ช่วงราคา</h4>
                <p className='fpage-b'>฿฿฿ ({item.price})</p>
            </div>
            </div>

            {showFullImage && (
                      <div className="full-image-overlay" onClick={closeFullImage}>
                        <div className="full-image-container">
                          <img src={fullImageUrl} className="full-image-container-img" alt="Full Size" />
                        </div>
                      </div>
                    )}
        </div>
    ))}
    </>
  )
}

export default Famouspage