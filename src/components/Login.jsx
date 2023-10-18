import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav';
import '../pagecss/Login.css'
import Swal from 'sweetalert2'

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { logIn } = useUserAuth();

    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

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
            await logIn(email, password);
            Swal.fire({
                icon: 'success',
                title: 'เข้าสู่ระบบ',
                showConfirmButton: false,
              })    
            navigate("/");
        } catch(err) {
            setError(err.message);
            console.log(err);
        }
    };


    return (
        <>
        <Nav/>
        <div>
            <div className="row-login">
            <Form onSubmit={handleSubmit}>
                    <div className="box-login">
                        <h2 className="errer-login">เข้าสู่ระบบ</h2>
                        {error && <Alert variant='danger'>{error}</Alert>}

                        <Form.Group className="email-login" controlId='formBasicEmail'>
                        <Form.Control 
                            className="form-control"
                            type='email'
                            placeholder='อีเมล'
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </Form.Group>

                        <Form.Group className="password-login" controlId='formBasicPassword'>
                        <Form.Control 
                            className="form-control"
                            type='password'
                            placeholder='รหัสผ่าน'
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </Form.Group>

                        <div className="button-login">
                        <Button className="button" variant="primary" type="submit">เข้าสู่ระบบ</Button>
                        </div>
                        <div className="login-to-register">
                        ยังไม่มีบัญชี? <Link to="/Register" className="link"> สมัครสมาชิค</Link>
                        </div>
                    </div>
                    </Form>

            </div>
        </div>
        </>
    )
}

export default Login