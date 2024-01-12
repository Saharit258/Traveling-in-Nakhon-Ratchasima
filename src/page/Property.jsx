import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav'
import { auth } from '../database/firebase';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";
import { collection, doc, setDoc, getDoc, query, getDocs } from 'firebase/firestore';
import { firestore } from '../database/firebase'

function Property() {
    const storageKey = 'users';
    const [hotel, setUserHotel] = useState([]);

    function encodeData(data) {
        const jsonData = JSON.stringify(data);
        return btoa(jsonData);
    }

    const [name, setName] = useState("");
    const [pname, setPname] = useState("");
    const [number, setNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    
    let navigate = useNavigate();

    const fetchDataFromFirestore = async () => {
        const q = query(collection(firestore, 'numderhotel'));
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setUserHotel(fetchedData);
    };

    useEffect(() => {
        fetchDataFromFirestore();
    }, []);

    console.log("data", hotel)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        if (password !== confirmPassword) {
            setError("รหัสผ่านและรหัสยืนยันไม่ตรงกัน");
            return;
        }
    
        const selectedHotel = hotel.find(h => h.number === number);
    
        if (!selectedHotel) {
            setError("Numder ไม่ถูกต้อง");
            return;
        }
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            const userData = {
                name: name,
                pname: pname,
                email: email,
                imgUrls: [],
                phonenumber: "",
                facility: [],
                detail: "",
                file:"",
                lat:'',
                lon:'',
                paddress:'',
                status:'',
                tel:'',
                address: selectedHotel.caddress,
                tambol: selectedHotel.ctambol,
                amper: selectedHotel.camper,
                zipcode: selectedHotel.czipcode,
                startdate: selectedHotel.startdate,
                enddate: selectedHotel.enddate,      
                usertype: "Partner",
            };
    
            const userProfilesCollectionRef = collection(firestore, 'hotels');
            const userProfileDocRef = doc(userProfilesCollectionRef, user.uid);
    
            await setDoc(userProfileDocRef, userData);
            localStorage.setItem(storageKey, encodeData({ user: userCredential.user }));
    
            console.log("User registered successfully with ID: ", user.id);
            navigate("/Home");
            alert("ลงทะเบียนที่พักเสร็จสิ้น");
        } catch (err) {
            setError(err.message);
            console.error("Error", err);
        }
    };
    
    return (
        <>
            <div>
                <div className="row">
                    <div className="col-md-6 mx-auto">
                        <h2 className="mb-3">ลงทะเบียนที่พักของท่าน</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId='formBasicNumder'>
                                <Form.Control
                                    type='text'
                                    placeholder='เลขประกอบธุรกิจที่พักอาศัย'
                                    onChange={(e) => setNumber(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicName'>
                                <Form.Control
                                    type='text'
                                    placeholder='ชื่อที่พัก'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicName'>
                                <Form.Control
                                    type='text'
                                    placeholder='ชื่อพาร์ทเนอร์'
                                    onChange={(e) => setPname(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicEmail'>
                                <Form.Control
                                    type='email'
                                    placeholder='อีเมล์'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicPassword'>
                                <Form.Control
                                    type='password'
                                    placeholder='รหัสผ่าน'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                                <Form.Control
                                    type='password'
                                    placeholder='ยืนยันรหัสผ่าน'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">ลงทะเบียน</Button>
                            </div>
                        </Form>
                        <div className="p-4 box mt-3 text-center">
                            มีบัญชีอยู่แล้ว? <Link to="/Login">เข้าสู่ระบบ</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Property;