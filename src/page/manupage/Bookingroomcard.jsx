import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { collection, getDocs, collectionGroup, doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import { Form, Button } from 'react-bootstrap';
import '../../pagecss/Bookingroomcard.css';

function Bookingroomcard() {
    const uid = new URLSearchParams(useLocation().search).get('uid');
    const [dataFromFirestore, setDataFromFirestore] = useState([]);
    const [dataFromFirestores, setDataFromFirestores] = useState([]);
    const [dataFromFirestoreshotel, setDataFromFirestoreshotel] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const { user } = useUserAuth();

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleCheckInDateChange = (e) => {
        setCheckInDate(e.target.value);
    };

    const handleCheckOutDateChange = (e) => {
        setCheckOutDate(e.target.value);
    };

    const calculateNumberOfDays = () => {
        const startDate = new Date(checkInDate);
        const endDate = new Date(checkOutDate);
        const daysDifference = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

        setNumberOfDays(daysDifference);
    };

    const calculateTotalPrice = () => {
        const price = parseFloat(dataFromFirestores[0]?.price);
        const total = numberOfDays * price;
        setTotalPrice(total);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        calculateNumberOfDays();
        calculateTotalPrice(); 
    };

    const fetchRooms = async () => {
        try {
            const arr = [];
            const querySnapshot = await getDocs(collectionGroup(firestore, 'rooms'));
            querySnapshot.forEach((doc) => {
                const profileData = doc.data();
                arr.push({ id: doc.id, ...profileData });
            });
            setDataFromFirestore(arr);
        } catch (error) {
            console.error('Error fetching rooms:', error.message);
        }
    };

    const fetchPost = async () => {
        try {
            const docRef = doc(firestore, 'hotels', dataFromFirestore[0]?.ruid, 'rooms', uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const fetchedData = { id: docSnap.id, ...docSnap.data() };
                setDataFromFirestores([fetchedData]);
            } else {
                console.log('Document not found.', uid);
                setDataFromFirestores([]);
            }
        } catch (error) {
            console.error('Error fetching post data:', error.message);
        }
    };

    const fetchPosthotel = async () => {
        try {
            const docRef = doc(firestore, 'hotels', dataFromFirestore[0]?.ruid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const fetchedData = { id: docSnap.id, ...docSnap.data() };
                setDataFromFirestoreshotel([fetchedData]);
            } else {
                console.log('Document not found.', uid);
                setDataFromFirestoreshotel([]);
            }
        } catch (error) {
            console.error('Error fetching post data:', error.message);
        }
    };

    const fetchPostuser = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const profilesCollectionRef = collection(userDocRef, 'profiles');
        try {
            const querySnapshot = await getDocs(profilesCollectionRef);
            const userProfileData = [];

            querySnapshot.forEach((doc) => {
                userProfileData.push(doc.data());
            });
            setTodos(userProfileData);
        } catch (err) {
            console.error("Error", err);
        }
    };

    useEffect(() => {
        fetchRooms().then(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (dataFromFirestore.length > 0) {
            fetchPost().then(() => setLoading(false));
        }
    }, [dataFromFirestore]);

    useEffect(() => {
        if (dataFromFirestore.length > 0) {
            fetchPosthotel().then(() => setLoading(false));
        }
    }, [dataFromFirestore]);

    useEffect(() => {
        fetchPostuser();
    }, []);

    return (
        <>
            <Nav />
            {loading ? (
                <p>Loading...</p>
            ) : dataFromFirestores.map((item) => (
                <div className='box-con-booking-c' key={item.id}>
                    <div className='box-con-booking'>
                        {dataFromFirestoreshotel.map((item2) => (
                            <div className="bookingroom-c-sidebar" key={item2.id}>
                                <h2>{item2.pname}</h2>
                                <span>{item2.address} {item2.tambol} อำเภอ{item2.amper} {item2.zipcode}</span>
                            </div>
                        ))}
                        {todos.map((item3) => (
                            <div className="bookingroom-c-product" key={item.id}>
                                <Form onSubmit={handleFormSubmit}>
                                    <Form.Group className="register-name" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Name'
                                            placeholder={item.roomno}
                                            value={item.roomno}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-name" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Name'
                                            placeholder={item.type}
                                            value={item.type}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-name" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Name'
                                            value={item.price}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-name" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Name'
                                            placeholder='ชื่อ-นามสกุล'
                                            value={item3.name}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-name" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Email'
                                            placeholder='อีเมล'
                                            value={item3.email}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-phone" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Phonenumber'
                                            placeholder='เบอร์โทรศัพท์'
                                            value={item3.phonenumber}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-phone" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='date'
                                            placeholder='วันเข้า'
                                            value={checkInDate}
                                            onChange={handleCheckInDateChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-phone" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='date'
                                            placeholder='วันออก'
                                            value={checkOutDate}
                                            onChange={handleCheckOutDateChange}
                                        />
                                    </Form.Group>

                                    <h1>แสดงผลของจำนวนวัน: {numberOfDays}</h1>
                                    <h1>ราคา: {totalPrice}</h1>
                                </Form>

                                <div className="button-submit-signup">
                                        <button onClick={calculateNumberOfDays}>ยืนยันวัน</button>
                                    </div>

                                    <div className="button-submit-signup">
                                        <button onClick={calculateTotalPrice}>ยืนยันราคา</button>
                                    </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            {dataFromFirestores.length === 0 && !loading && <p>Loading...</p>}
        </>
    );
}

export default Bookingroomcard;
