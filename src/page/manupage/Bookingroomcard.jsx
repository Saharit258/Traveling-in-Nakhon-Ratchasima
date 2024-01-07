import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { collection, getDocs, collectionGroup, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import { Form, Button } from 'react-bootstrap';
import '../../pagecss/Bookingroomcard.css';

function Bookingroomcard() {
    const uid = new URLSearchParams(useLocation().search).get('uid');
    const [dataFromFirestore, setDataFromFirestore] = useState([]);
    const [dataFromFirestores, setDataFromFirestores] = useState([]);
    const [dataFromFirestoreshotel, setDataFromFirestoreshotel] = useState([]);
    const [dataFromFirestoreshotelbooking, setDataFromFirestoreshotelbooking] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([]);
    const { user } = useUserAuth();

    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const [name, setName] = useState("");

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
                if (profileData.uid === uid) {
                    arr.push({ id: doc.id, ...profileData });
                }
            });
            setDataFromFirestore(arr);
            console.log('Data from Firestore:', arr);
        } catch (error) {
            console.error('Error fetching rooms:', error.message);
        }
    };

    useEffect(() => {
        fetchRooms().then(() => setLoading(false));
    }, []);
    

    const fetchPost = async () => {
        try {
            const docRef = doc(firestore, 'hotels', dataFromFirestore[0]?.ruid, 'rooms', uid);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const fetchedData = { id: docSnap.id, ...docSnap.data() };
                setDataFromFirestores([fetchedData]);
            } else {
                console.log('Document not found.', dataFromFirestore[0]?.ruid);
                setDataFromFirestores([]);
            }
        } catch (error) {
            console.error('Error fetching post data:', error.message);
        }
    };

    useEffect(() => {
        if (dataFromFirestore.length > 0) {
            fetchPost().then(() => setLoading(false));
        }
    }, [dataFromFirestore]);
    

    const fetchPosthotel = async () => {
        try {
            const docRef = doc(firestore, 'hotels', dataFromFirestores[0]?.ruid);
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
        if (dataFromFirestore.length > 0) {
            fetchPosthotel().then(() => setLoading(false));
        }
    }, [dataFromFirestore]);

    useEffect(() => {
        fetchPostuser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const overlappingBookings = dataFromFirestoreshotelbooking.filter((booking) => {
                const existingCheckInDate = new Date(booking.checkInDate);
                const existingCheckOutDate = new Date(booking.checkOutDate);
                const newCheckInDate = new Date(checkInDate);
                const newCheckOutDate = new Date(checkOutDate);

                return (
                    (newCheckInDate >= existingCheckInDate && newCheckInDate < existingCheckOutDate) ||
                    (newCheckOutDate > existingCheckInDate && newCheckOutDate <= existingCheckOutDate) ||
                    (newCheckInDate <= existingCheckInDate && newCheckOutDate >= existingCheckOutDate)
                );
            });

            if (overlappingBookings.length > 0) {
                alert('วันที่ที่เลือกซ้อนทับกับการจองที่มีอยู่ โปรดเลือกวันที่อื่น');
            } else {
                const userData = {
                    email: todos[0]?.email,
                    bookingtype: "what",
                    name: todos[0]?.name,
                    phonenumber: todos[0]?.phonenumber,
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    numberOfDays: numberOfDays,
                    totalPrice: totalPrice,
                    uuid: user.uid,
                    huid: dataFromFirestores[0]?.ruid,
                    ruid: uid
                };

                const userBookingCollectionRef = collection(firestore, 'users', user.uid, 'bookings');
                const userBookingDocRef = await addDoc(userBookingCollectionRef, userData);

                alert(userBookingDocRef.id);
            }
        } catch (err) {
            console.error("Error", err);
        }
    };
    

    const handleSubmits = async (e) => {
        e.preventDefault();
    
        try {
            const overlappingBookings = dataFromFirestoreshotelbooking.filter((booking) => {
                const existingCheckInDate = new Date(booking.checkInDate);
                const existingCheckOutDate = new Date(booking.checkOutDate);
                const newCheckInDate = new Date(checkInDate);
                const newCheckOutDate = new Date(checkOutDate);
    
                return (
                    (newCheckInDate >= existingCheckInDate && newCheckInDate < existingCheckOutDate) ||
                    (newCheckOutDate > existingCheckInDate && newCheckOutDate <= existingCheckOutDate) ||
                    (newCheckInDate <= existingCheckInDate && newCheckOutDate >= existingCheckOutDate)
                );
            });
    
            if (overlappingBookings.length > 0) {
            } else {
                const userData = {
                    email: todos[0]?.email,
                    bookingtype: "what",
                    name: todos[0]?.name,
                    phonenumber: todos[0]?.phonenumber,
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    numberOfDays: numberOfDays,
                    totalPrice: totalPrice,
                    uuid: user.uid,
                    huid: dataFromFirestores[0]?.ruid,
                    ruid: uid
                };
    
                const userBookingCollectionRef = collection(firestore, 'hotels', dataFromFirestores[0]?.ruid, 'hbookings');
                const userBookingDocRef = await addDoc(userBookingCollectionRef, userData);
    
                alert(userBookingDocRef.id);
            }
        } catch (err) {
            console.error("Error", err);
        }
    };
    

    const fetchbooking = async () => {
        try {
            const arr = [];
            const querySnapshot = await getDocs(collectionGroup(firestore, 'hbookings'));
            querySnapshot.forEach((doc) => {
                const profileData = doc.data();
                arr.push({ id: doc.id, ...profileData });
            });
            setDataFromFirestoreshotelbooking(arr);
        } catch (error) {
            console.error('Error fetching rooms:', error.message);
        }
    };

    useEffect(() => {
        fetchbooking();
      }, []);
    
    

    return (
        <>
            <Nav />
            {loading ? (
                <p>Loading...</p>
            ) : dataFromFirestores.map((item) => (
                <div className='box-con-booking-c' key={item.id}>
                    <div className='box-con-booking'>
                        <div className="bookingroom-c-sidebar">
                            <h2>{item.roomno}</h2>
                            <p>{item.type}</p>
                        </div>
                    {/* {dataFromFirestoreshotel.length > 0 ? (
                        <div className="bookingroom-c-sidebar">
                            <h2>{dataFromFirestoreshotel[0].pname}</h2>
                            <span>{dataFromFirestoreshotel[0].address} {dataFromFirestoreshotel[0].tambol} อำเภอ{dataFromFirestoreshotel[0].amper} {dataFromFirestoreshotel[0].zipcode}</span>
                        </div>
                    ) : (
                        <p>Loading hotel information...</p>
                    )} */}

                        {todos.map((item3) => (
                            <div className="bookingroom-c-product" key={item.id}>
                                <Form onSubmit={(e) => {
                                            handleSubmits(e);
                                            handleSubmit(e);
                                        }}>
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
                                            onChange={(e) => setName(e.target.value)}
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

                                    <Form.Group className="register-phone" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Phonenumber'
                                            placeholder='เบอร์โทรศัพท์'
                                            value={numberOfDays}
                                            onChange={(e) => setTotalPrice(e.target.value)}
                                        />
                                    </Form.Group>

                                    <Form.Group className="register-phone" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control"
                                            type='Phonenumber'
                                            placeholder='เบอร์โทรศัพท์'
                                            value={totalPrice}
                                        />
                                    </Form.Group>

                                    <div className="button-submit-signup-divbooking">
                                        <button variant="primary" className="button-submit-signup-booking" type="submit">จองที่พัก</button>
                                    </div>
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
