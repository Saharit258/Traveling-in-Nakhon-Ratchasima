import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav'

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
            return;
        }         
        
        if (password.length < 8) {
            setError("รหัสผ่านไม่ครบ 8 ตัว");
            return;
        }

        try {
            // Sign up the user
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const profile_image = 'https://img.freepik.com/free-vector/colorful-bird-illustration-gradient_343694-1741.jpg?w=740&t=st=1695823555~exp=1695824155~hmac=18698f7d46090413fa1a239f3f23784ebbd40fa40f2906e69b476de21a61fa07'

            // After successful signup, add user data to Firestore
            const userData = {
                Name: name,
                Email: email, 
                Profile: profile_image,
                Phonenumber : "",
                Birthday : "",
                Address : "",              
            };
            
            const userProfilesCollectionRef = collection(firestore, 'users', user.uid, 'profiles');
            const userProfileDocRef = doc(userProfilesCollectionRef, user.uid);

            await setDoc(userProfileDocRef, userData);
            localStorage.setItem(storageKey, encodeData({ user: userCredential.user }));

            console.log("User registered successfully with ID: ", user.id);
            navigate("/"); // Redirect to home page
            alert("สมัครสมาชิกเสร็จสิ้น");
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
                    <div className="col-md-6 mx-auto">
                        <h2 className="mb-3">Register</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId='formBasicName'>
                                <Form.Control
                                    type='text' // Changed to 'text' for the name field
                                    placeholder='Name'
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicEmail'>
                                <Form.Control
                                    type='email'
                                    placeholder='Email address'
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicPassword'>
                                <Form.Control
                                    type='password'
                                    placeholder='Password'
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId='formBasicConfirmPassword'>
                                <Form.Control
                                    type='password'
                                    placeholder='Confirm Password'
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">Sign Up</Button>
                            </div>
                        </Form>
                        <div className="p-4 box mt-3 text-center">
                            Already have an account? <Link to="/Login">Log in</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register;
