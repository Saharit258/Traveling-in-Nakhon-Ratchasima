import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { collection, getDocs, collectionGroup, doc, getDoc, setDoc, addDoc } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import { Form, Button } from 'react-bootstrap';
import '../../pagecss/Bookingroomcard.css';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';

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

    const navigate = useNavigate();

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
        fetchPosthotel();
    }, [dataFromFirestore]);

    useEffect(() => {
        fetchPostuser();
    }, []);
    

    const handleSubmits = async (e) => {
        e.preventDefault();
    
        try {
            const overlappingBookings = dataFromFirestoreshotelbooking.filter((booking) => {
                if (booking.ruid === uid) {
                    const existingCheckInDate = new Date(booking.checkInDate);
                    const existingCheckOutDate = new Date(booking.checkOutDate);
                    const newCheckInDate = new Date(checkInDate);
                    const newCheckOutDate = new Date(checkOutDate);
    
                    return (
                        (newCheckInDate >= existingCheckInDate && newCheckInDate < existingCheckOutDate) ||
                        (newCheckOutDate > existingCheckInDate && newCheckOutDate <= existingCheckOutDate) ||
                        (newCheckInDate <= existingCheckInDate && newCheckOutDate >= existingCheckOutDate)
                    );
                }
                return false;
            });
    
            if (overlappingBookings.length > 0) {
                alert('วันที่ที่เลือกซ้อนทับกับการจองที่มีอยู่ โปรดเลือกวันที่อื่น');
            } else {
                const userData = {
                    email: todos[0]?.email,
                    bookingtype: "จอง",
                    name: todos[0]?.name,
                    phonenumber: todos[0]?.phonenumber,
                    checkInDate: checkInDate,
                    checkOutDate: checkOutDate,
                    numberOfDays: numberOfDays,
                    totalPrice: totalPrice,
                    uuid: user.uid,
                    huid: dataFromFirestores[0]?.ruid,
                    ruid: uid,
                    pay: "รอการจ่ายเงิน",
                    roomno: dataFromFirestores[0]?.roomno
                };
    
                const userBookingCollectionRef = collection(firestore, 'hotels', dataFromFirestores[0]?.ruid, 'hbookings');
                const userBookingDocRef = await addDoc(userBookingCollectionRef, userData);
    
                alert("การจองสำเร็จ ",userBookingDocRef.id);

                navigate(`/Expend?uid=${userBookingDocRef.id}`);
            }
        } catch (err) {
            console.error("Error", err);
        }
    };
    
    console.log("dataFromFirestoreshotel", dataFromFirestoreshotel)

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
    

      const localizer = momentLocalizer(moment);

      const events = [
        {
            title: 'Check-In',
            start: new Date('2024-01-10'),
            end: new Date('2024-01-10'),
            allDay: true,
            className: 'red-event',
        },
        {
            title: 'Check-Out',
            start: new Date('2024-01-15'),
            end: new Date('2024-01-15'),
            allDay: true,
            className: 'red-event',
        },
    ];

    const eventStyleGetter = (event) => {
        const startDate = moment('2024-01-10').startOf('day');
        const endDate = moment('2024-01-15').endOf('day');
        const eventDate = moment(event.start).startOf('day');

        const style = {
            backgroundColor:
                eventDate.isBetween(startDate, endDate, null, '[]') ? 'red' : 'blue',
            borderRadius: '5px',
            opacity: 0.8,
            color: 'white',
            border: '1px solid #ccc',
            display: 'block',
            textAlign: 'center',
        };

        return {
            style,
        };
    };
    

    return (
        <>
            <Nav />
            {loading ? (
                <p>Loading...</p>
            ) : dataFromFirestores.map((item) => (
                <div className='box-con-booking-c' key={item.id}>
                    <div className='box-con-booking'>
                        <div className="bookingroom-c-sidebar">
                            <div className="sidebar-taxt-booking">
                                <h2 className="sidebar-taxt-booking-h2">ห้อง{item.roomno}</h2>
                                <h2 className="sidebar-taxt-booking-h2-r">{item.type}</h2>
                            </div>
                            <div className="bookingroom-c-calendar">
                            <Calendar
                                    localizer={localizer}
                                    events={events}
                                    views={['month']}
                                    style={{ height: 200 }}
                                    eventStyleGetter={eventStyleGetter}
                                />
                                </div>

                            <div className='ewef'>

                                <h3>จำนวนวันและราคา</h3>

                            <input         
                                className="form-control"
                                type='Phonenumber'
                                placeholder='เบอร์โทรศัพท์'
                                value={numberOfDays}
                                onChange={(e) => setTotalPrice(e.target.value)}/>
                            </div>

                            <div className='ss'>
                                <button className='bhjbj' onClick={calculateNumberOfDays} >ยืนยันวัน</button>
                            </div>


                            <div className='ewef'>

                                <input         
                                            className="form-control"
                                            type='Phonenumber'
                                            placeholder='เบอร์โทรศัพท์'
                                            value={totalPrice}/>
                                </div>

                                <div className='ss'>
                                    <button className='bhjbj' onClick={calculateTotalPrice} >ยืนยันวัน</button>
                                </div>

                            

                        </div>

                        <div className="bookingroom-c-product">
                        {todos.map((item3) => (
                            <div className='dfsdf' key={item.id}>
                                <Form onSubmit={(e) => {
                                            handleSubmits(e);
                                        }}>

                                    <div className="from-booking-g">
                                        <h4>ห้องพัก:</h4>
                                        <Form.Group className="from-booking-name" controlId='formBasicName'>
                                            <Form.Control
                                                className="from-booking"
                                                type='Name'
                                                placeholder={item.roomno}
                                                value={item.roomno}
                                            />
                                        </Form.Group>

                                        <h4 className="from-booking-namde">ประเภท:</h4>
                                        <Form.Group className="from-booking-name-e" controlId='formBasicName'>
                                            <Form.Control
                                                className="from-booking"
                                                type='Name'
                                                placeholder={item.type}
                                                value={item.type}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="register-name-priced">
                                        <h4>ราคา:</h4>
                                        <Form.Group className="register-name" controlId='formBasicName'>
                                            <Form.Control
                                                className="form-control-priced"
                                                type='Name'
                                                value={item.price}
                                            />
                                        </Form.Group>
                                    </div>


                                    <div className="register-name-priced">
                                        <h4>ชื่อ:</h4>
                                        <Form.Group className="register-name" controlId='formBasicName'>
                                            <Form.Control
                                                className="form-control-priced-name"
                                                type='Name'
                                                placeholder='ชื่อ-นามสกุล'
                                                value={item3.name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Form.Group>
                                    </div>

                                    <div className="register-name-priced">
                                        <h4>อีเมล:</h4>
                                        <Form.Group className="register-name" controlId='formBasicName'>
                                            <Form.Control
                                                className="form-control-priced"
                                                type='Email'
                                                placeholder='อีเมล'
                                                value={item3.email}
                                            />
                                        </Form.Group>
                                    </div>


                                    <div className="register-name-priced">
                                        <h4>เบอร์:</h4>
                                        <Form.Group className="register-phone" controlId='formBasicName'>
                                            <Form.Control
                                                className="form-control-priced"
                                                type='Phonenumber'
                                                placeholder='เบอร์โทรศัพท์'
                                                value={item3.phonenumber}
                                            />
                                        </Form.Group>
                                    </div>


                                    <div className="register-name-priced">
                                    <h4>วันเข้าพัก:</h4>
                                    <Form.Group className="register-phone" controlId='formBasicName'>
                                        <Form.Control
                                            className="form-control-priced-in"
                                            type='date'
                                            placeholder='วันเข้า'
                                            value={checkInDate}
                                            onChange={handleCheckInDateChange}
                                        />
                                    </Form.Group>
                                    </div>

                                    <div className="register-name-priced">
                                    <h4>วันที่ออก:</h4>
                                    <Form.Group className="register-phone" controlId='formBasicName'>
                                            <Form.Control
                                                className="form-control-priced-out"
                                                type='date'
                                                placeholder='วันออก'
                                                value={checkOutDate}
                                                onChange={handleCheckOutDateChange}
                                            />
                                        </Form.Group>
                                        </div>

                                    <div className="button-submit-signup-divbooking">
                                        <button variant="primary" className="button-submit-signup-booking" type="submit">จองที่พัก</button>
                                    </div>
                                </Form>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            ))}
            {dataFromFirestores.length === 0 && !loading && <p>Loading...</p>}
        </>
    );
}

export default Bookingroomcard;
