import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import { Form, Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import '../../pagecss/Expend.css'
import { useNavigate } from 'react-router-dom';

function Expend() {
    const { user } = useUserAuth();
    const uid = new URLSearchParams(useLocation().search).get('uid');
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const fetchPost = async () => {
        try {
            const docRef = doc(firestore, 'users', user.uid, 'bookings', uid);
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
    }, [user]);

    const handlePayment = async () => {
        try {
            const docRef = doc(firestore, 'users', user.uid, 'bookings', uid);
            await setDoc(docRef, { ...data[0], pay: 'จ่ายเงินแล้ว' }, { merge: true });
            alert("จ่ายเงินแล้ว")
            navigate('/Bookinghistory');
        } catch (error) {
            console.error('Error processing payment:', error.message);
        }
    };

    return (
        <>
            <Nav />
            <div className="pay-card">
                <div className="box-pay">
                    <div className="pay-card-box">
                        <QRCode className="box-pay-QR" value={data[0]?.totalPrice.toString()} size={400} />
                    </div>

                    {data.map((item) => (
                        <div className="pay-text" key={item.id}>
                            <h2>{item.name}</h2>
                            <p>ราคา: {item.totalPrice}</p>
                            <p>สภานะ: {item.pay}</p>
                            <button onClick={handlePayment}>จ่ายเงิน</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Expend;
