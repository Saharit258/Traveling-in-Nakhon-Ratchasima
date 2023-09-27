import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav'

import { collection, addDoc } from 'firebase/firestore'; // Remove unnecessary import
import { firestore } from '../database/firebase'

function Register() {

    const storageKey = 'users';

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { signUp } = useUserAuth();
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("รหัสผ่านและรหัสยืนยันไม่ตรงกัน");
            return;
        }

        try {
            // Sign up the user
            const userCredential = await signUp(email, password);
            const user = userCredential.user;

            // After successful signup, add user data to Firestore
            const userData = {
                Name: name, // Assuming 'firstname' is defined elsewhere in your code
            };
            
            const userProfilesCollectionRef = collection(database, 'users', user.uid, 'profiles');
            const userProfileDocRef = doc(userProfilesCollectionRef, user.uid);

            await setDoc(userProfileDocRef, userData);
            localStorage.setItem(this.storageKey, this.encodeData({ user: userCredential.user }));

            console.log("User registered successfully with ID: ", user.id);
            // navigate("/"); // Redirect to home page
            alert("สมัครสมาชิกเสร็จสิ้น");
        } catch (err) {
            setError(err.message);
            console.error("Error", err);
        }
    };

        //     try {
        //         const userCredential = await createUserWithEmailAndPassword(email, password);
        //         const user = userCredential.user;

        //         const userData = {
        //             Name: name, // Assuming 'firstname' is defined elsewhere in your code
        //         };

        //         // Create a new subcollection for the user profiles and set the user data as a document within it
        //         const userProfilesCollectionRef = collection(database, 'users', user.uid, 'profiles');
        //         const userProfileDocRef = doc(userProfilesCollectionRef, user.uid);

        //         await setDoc(userProfileDocRef, userData);
        //         localStorage.setItem(this.storageKey, this.encodeData({ user: userCredential.user }));
        //         console.log('Registration successful');
        //         alert('Registration successful');
        //     } catch (error) {
        //         console.error("Error", error);
        //     }
        // };

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
