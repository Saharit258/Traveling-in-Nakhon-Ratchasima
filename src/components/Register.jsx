import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../pagecss/LR.css'
import Swal from 'sweetalert2'

import { auth } from '../database/firebase';

import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut
} from "firebase/auth";

import { collection, addDoc, doc, setDoc } from 'firebase/firestore'; // Remove unnecessary import
import { firestore } from '../database/firebase'

function Register() {

    const storageKey = 'users';

    function encodeData(data) {
        const jsonData = JSON.stringify(data);
        return btoa(jsonData);
    }

    const [name, setName] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [birthday, setBirthday] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("รหัสผ่านและรหัสยืนยันไม่ตรงกัน");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'รหัสผ่านและรหัสยืนยันไม่ตรงกัน',
              })
            return;
        }         
        
        if (password.length < 8) {
            setError("รหัสผ่านไม่ครบ 8 ตัว");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'รหัสผ่านไม่ครบ 8 ตัว',
              })
            return;
        }

        if (!/^[^A-Za-z]+$/.test(password)) {
            setError("รหัสผ่านต้องไม่มีตัวอักษร A-Z หรือ a-z");
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'รหัสผ่านต้องไม่มีตัวอักษร A-Z หรือ a-z',
              })
            return;
        }

        try {
            // Sign up the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const profile_image = 'https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?w=740&t=st=1695823555~exp=1695824155~hmac=18698f7d46090413fa1a239f3f23784ebbd40fa40f2906e69b476de21a61fa07'

            // After successful signup, add user data to Firestore
            const userData = {
                name: name,
                email: email, 
                profile: profile_image,
                phonenumber : phonenumber,
                birthday : birthday,
                address : address,
                usertype : "User",               
            };
            
            const userProfilesCollectionRef = collection(firestore, 'users', user.uid, 'profiles');
            const userProfileDocRef = doc(userProfilesCollectionRef, user.uid);

            await setDoc(userProfileDocRef, userData);
            localStorage.setItem(storageKey, encodeData({ user: userCredential.user }));

            console.log("User registered successfully with ID: ", user.id);
            navigate("/"); // Redirect to home page
            Swal.fire({
                icon: 'success',
                title: 'สมัครสมาชิกเสร็จสิ้น',
                showConfirmButton: false,
              })  
        } catch (err) {
            setError(err.message);
            console.error("Error", err);
        }
    };

    return (
        <>
            <Nav />
            <div>
                <div className="row">
                <Form onSubmit={handleSubmit}>
                        <div className="box-register">
                            <h2 className="errer-login">สมัครสมาชิค</h2>
                            {error && <Alert variant='danger'>{error}</Alert>}

                            <Form.Group className="register-name" controlId='formBasicName'>
                            <Form.Control
                                className="form-control"
                                type='Name'
                                placeholder='ชื่อ-นามสกุล'
                                onChange={(e) => setName(e.target.value)}
                            />
                            </Form.Group>

                            <Form.Group className="register-phone" controlId='formBasicName'>
                            <Form.Control
                                className="form-control"
                                type='Phonenumber'
                                placeholder='เบอร์โทรศัพท์'
                                onChange={(e) => setPhonenumber(e.target.value)}
                            />
                            </Form.Group>

                            <Form.Group className="register-birthday" controlId='formBasicName'>
                            <Form.Control
                                type="date"
                                onChange={(e) => setBirthday(e.target.value)}
                                dateFormat="MM/dd/yyyy"
                                placeholderText='Birthday'
                            />
                            </Form.Group>

                            <Form.Group className="register-add" controlId='formBasicName'>
                            <Form.Control
                                className="form-control"
                                type='Address'
                                placeholder='ที่อยู่ปัจจุบัน'
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            </Form.Group>

                            <Form.Group className="register-email" controlId='formBasicEmail'>
                            <Form.Control
                                className="form-control"
                                type='email'
                                placeholder='อีเมล'
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            </Form.Group>

                            <Form.Group className="register-password" controlId='formBasicPassword'>
                            <Form.Control
                                className="form-control"
                                type='password'
                                placeholder='รหัสผ่าน'
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            </Form.Group>

                            <Form.Group className="register-confirm" controlId='formBasicConfirmPassword'>
                            <Form.Control
                                className="form-control"
                                type='password'
                                placeholder='Confirm Password'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            </Form.Group>

                            <div className="button-submit-signup">
                            <Button variant="primary" type="submit">ลงชื่อเข้าใช้</Button>
                            </div>
                            <div className="button-to-login">
                               มีบัญชีอยู่แล้ว? <Link to="/Login" className="link">เข้าสู่ระบบ</Link>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    )
}

export default Register;
