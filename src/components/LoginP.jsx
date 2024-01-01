import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import { doc, getDoc, collection } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import Nav from "../navigation/Nav";
import '../pagecss/login.css'

function LoginP() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loginType, setLoginType] = useState("Partner"); 
    const { logIn } = useUserAuth();
    const navigate = useNavigate();

    const Login = () => {
        navigate('/Login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const userCredential = await logIn(email, password);
            const user = userCredential.user;
    
            const userProfileDocRef = doc(firestore, 'hotels', user.uid,);
    
            const userProfileSnapshot = await getDoc(userProfileDocRef);
    
            if (userProfileSnapshot.exists()) {
                const usertype = userProfileSnapshot.data().usertype;
                console.log("User Type:", usertype);
    
                if (loginType === "Partner" && usertype === "Partner") {
                    navigate("/");
                } else {
                    setError("ประเภทการเข้าสู่ระบบไม่ถูกต้อง");
                }
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
        <Nav/>
            <div className='body'>
                <div className="input-box-ty">
                    <Form onSubmit={handleSubmit}>
                        <div className='login-box'>
                            <h2 className='login-box-h2'>ลงชื่อเข้าใช้ผู้สนับสนุน</h2>
                            {error && <Alert variant='danger'>{error}</Alert>}

                            <div className="usertype">
                                <div className="rl-p">
                                    <button className="rl-l-p" onClick={Login}>ผู้ใช้งาน</button>
                                    <button className="rl-r-p">ผู้สนับสนุน</button>
                                </div>
                            </div>

                            <Form.Group controlId="loginType">
                                    <Form.Control
                                        as="select"
                                        value={loginType}
                                        onChange={(e) => setLoginType(e.target.value)}
                                    >
                                        <option value="Partner">Partner</option>
                                        
                                    </Form.Control>
                                </Form.Group>

                                <div className="li"></div>


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
                                <button className="button-login-1" variant="primary" type="submit">เข้าสู่ระบบ</button>
                            </div>

                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}

export default LoginP;
