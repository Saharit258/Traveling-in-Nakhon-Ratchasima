import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import { doc, getDoc, collection } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../admin/admincss/LoginAdmin.css'

function LoginAdmin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loginType, setLoginType] = useState("user"); 
    const { logIn } = useUserAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userCredential = await logIn(email, password);
            const user = userCredential.user;

            const userProfileCollectionRef = collection(firestore, 'users', user.uid, 'profiles');
            const userProfileDocRef = doc(userProfileCollectionRef, user.uid);

            const userProfileSnapshot = await getDoc(userProfileDocRef);

            if (userProfileSnapshot.exists()) {
                const userType = userProfileSnapshot.data().usertype;
                console.log("User Type:", userType);

                if (loginType === "admin" && userType === "Admin") {
                    navigate("/HomeAdmin");
                } else if (loginType === "Partner" && userType === "Partner") {
                    navigate("/Hotel");
                } else if (loginType === "user" && userType === "User") {
                    window.location.href = "/"; //ลิ้งหน้าที่จะแสดงผล อย่าลืมเปลี่ยน
                }else {
                    setError("ประเภทการเข้าสู่ระบบไม่ถูกต้อง");                }
            } else {
                setError("ข้อมูลผู้ใช้ไม่ถูกต้อง");
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <>
            <div className='body-ad'>
                <div className="input-box">
                    <Form onSubmit={handleSubmit}>
                        <div className='login-box'>
                            <h2 className='login-box-h2-ad'>ลงชื่อเข้าใช้</h2>
                            {error && <Alert variant='danger'>{error}</Alert>}

                            <Form.Group controlId="loginType">
                                    <Form.Control
                                        as="select"
                                        value={loginType}
                                        onChange={(e) => setLoginType(e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="Partner">Partner</option>
                                        <option value="admin">Admin</option>

                                    </Form.Control>
                                </Form.Group>


                            <div className="login-in-input">
                                <Form.Group className='login-box-input' controlId='formBasicEmail'>
                                    <Form.Control
                                        className='login-box-input-email'
                                        type='email'
                                        placeholder='อีเมล'
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className='login-box-input-password' controlId='formBasicPassword'>
                                    <Form.Control
                                        className='login-box-input-password'
                                        type='password'
                                        placeholder='รหัสผ่าน'
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>

                            </div>

                            <div className="button-login">
                                <Button className="button-login-1" variant="primary" type="submit">เข้าสู่ระบบ</Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default LoginAdmin;
