import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from '../navigation/Nav';
import { useUserAuth } from '../context/UserAuthContext';
import { collection, getDocs, collectionGroup, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import Barcode from 'react-barcode';
import '../pagecss/Usecoupon.css';
import { useNavigate } from 'react-router-dom';

function Usecoupon() {
    const uid = new URLSearchParams(useLocation().search).get('uid');
    const [data, setData] = useState([]);
    const { user } = useUserAuth();

    const navigate = useNavigate();
    const [redirectTimer, setRedirectTimer] = useState(null);
    const [remainingTime, setRemainingTime] = useState(900);


    const fetchPost = async () => {
        try {
            const docRef = doc(firestore, 'users', user.uid, 'coupon', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const fetchedData = { id: docSnap.id, ...docSnap.data() };
                setData([fetchedData]);
            } else {
                console.log('Document not found.', uid);
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching post data:', error.message);
        }
    };

    const startRedirectTimer = () => {
        const timer = setInterval(() => {
            setRemainingTime((prevTime) => prevTime - 1);
        }, 1000);
        setRedirectTimer(timer);
    };

    const clearRedirectTimer = () => {
        if (redirectTimer) {
            clearInterval(redirectTimer);
        }
    };

//     const startRedirectTimerInMinutes = (minutes) => {
//     const seconds = minutes * 60; // Convert minutes to seconds
//     const timer = setInterval(() => {
//         setRemainingTime((prevTime) => prevTime - 1);
//     }, 1000);

//     setRedirectTimer(timer);
// };

    

    const markCouponAsUsed = async () => {
        try {
            const docRef = doc(firestore, 'users', user.uid, 'coupon', uid);
            await updateDoc(docRef, { type: 'ใช้งานแล้ว' });
            startRedirectTimer();
        } catch (error) {
            console.error('Error updating coupon:', error.message);
        }
    };

    useEffect(() => {
        fetchPost();

        return () => {
            clearRedirectTimer();
        };
    }, [user]);

    useEffect(() => {
        if (remainingTime === 0) {
            navigate("/Mycoupon");
            clearRedirectTimer();
        }
    }, [remainingTime]);

    console.log('data', data);

    return (
        <>
            <Nav />

            <div className="card">
                <h2>โปรโมชันและสิทธิพิเศษ</h2>
            </div>

            {data.map((item) => (
                <div className="card-coupon" key={item.id}>
                    <div className="coupon-box">
                        <div className="img">
                            <img  className="img-coupon-card" src={item.image} alt="" />
                        </div>
                        <div className="text-coupon">
                            <h2>{item.promotionname}</h2>
                            <p>{item.about}</p>
                            <p>{item.type}</p>
                            <div>
                                <Barcode value={item.discount} />
                            </div>
                            <p>จากกดใช้งานแล้วจะต้องใช้งานใน 900 วินาที</p>
                            <p>เหลือเวลา: {remainingTime} วินาที</p>
                            <button onClick={markCouponAsUsed}>ใช้งาน</button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}

export default Usecoupon;