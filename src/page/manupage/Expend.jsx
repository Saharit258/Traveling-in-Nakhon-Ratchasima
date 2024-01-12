import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import { Form, Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import '../../pagecss/Expend.css'
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';

function Expend() {
    const { user } = useUserAuth();
    const uid = new URLSearchParams(useLocation().search).get('uid');
    const [data, setData] = useState([]);
    const [hotel, setHotel] = useState([]);
    const [booking, setBooking] = useState([]);
    const navigate = useNavigate();

    const fetchPosthotels = async () => {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const bookingsCollectionRef = collection(userDocRef, 'bookings');
          
          const querySnapshot = await getDocs(bookingsCollectionRef);
          const bookingData = [];
      
          querySnapshot.forEach((doc) => {
            bookingData.push({ id: doc.id, ...doc.data() });
          });
      
          setBooking(bookingData);
        } catch (error) {
          console.error('Error fetching booking data:', error.message);
        }
      };
      
      useEffect(() => {
        fetchPosthotels();
      }, [user]);

    const fetchPost = async () => {
        try {
            const docRef = doc(firestore, 'hotels', booking[0]?.huid, 'hbookings', uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fetchedData = { id: docSnap.id, ...docSnap.data() };
                setData([fetchedData]);
            } else {
                setData([]);
            }
        } catch (error) {
            console.error('Error fetching post data:', error.message);
        }
    };

    useEffect(() => {
        fetchPost();  
    }, [booking]);

    const fetchPosts = async () => {
        try {
            const docRef = doc(firestore, 'hotels', data[0]?.huid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const fetchedData = { id: docSnap.id, ...docSnap.data() };
                setHotel([fetchedData]);
            } else {
                setHotel([]);
            }
        } catch (error) {
            console.error('Error fetching post data:', error.message);
        }
    };

    useEffect(() => {
        fetchPosts();  
    }, [data]);

    const handlePayment = async () => {
        try {
            const docRef = doc(firestore, 'hotels', booking[0]?.huid, 'hbookings', uid);
            await setDoc(docRef, { ...data[0], pay: 'จ่ายเงินแล้ว' }, { merge: true });
            alert("จ่ายเงินแล้ว")
            navigate('/Bookinghistory');
        } catch (error) {
            console.error('Error processing payment:', error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy');
      };

    return (
        <>
            <Nav />
            <div className="card-Famous">
                <h2>กรอกรายละเอียดข้อมูลชำระเงิน</h2>
            </div>
            <div className="pay-qr-card">
                <div className="sid-card">
                        <div className="pay-text-1">
                            <h3>ชื่อ: </h3>
                            <h3>ผู้รับ: </h3>
                            <h3>วันที่เข้า: </h3>
                            <h3>วันที่ออก: </h3>
                            <h3>ราคา: </h3>
                            <h3>สภานะ: </h3>
                        </div>
                {data.map((item) => (
                        <div className="pay-text" key={item.id}>
                            <input  className="form-control-pay"
                                type='Name'
                                placeholder={item.name}
                                onChange={item.name}
                                value={item.name} />
                            <input  className="form-control-pay"
                                type='Name'
                                value={hotel[0]?.pname} />
                            <input  className="form-control-pay"
                                type='Name'
                                placeholder={item.checkInDate}
                                onChange={item.checkInDate}
                                value={formatDate(item.checkInDate)} />
                            <input  className="form-control-pay"
                                type='Name'
                                placeholder={item.checkOutDate}
                                onChange={item.checkOutDate}
                                value={formatDate(item.checkOutDate)} />
                            <input  className="form-control-pay"
                                type='Name'
                                placeholder={item.totalPrice}
                                onChange={item.totalPrice}
                                value={item.totalPrice} />
                            <input  className="form-control-pay"
                                type='Name'
                                placeholder={item.pay}
                                onChange={item.pay}
                                value={item.pay} />
                        </div>
                    ))}
                </div>
                <div className="pro-card">
                <div className="pay-card-box">
                        <QRCode className="box-pay-QR" value={data[0]?.totalPrice.toString()} size={400} />
                    </div>
                    <div className="button-pay-1">
                        <button className="button-pay-2" onClick={handlePayment}>จ่ายเงิน</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Expend;
