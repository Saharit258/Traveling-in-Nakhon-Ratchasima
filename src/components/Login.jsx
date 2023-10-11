import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'
import { Form, Alert, Button } from 'react-bootstrap'
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav'

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
            return;
        }

        if (!/^[^A-Za-z]+$/.test(password)) {
            setError("รหัสผ่านต้องไม่มีตัวอักษร A-Z หรือ a-z");
            return;
        }

        try {
            await logIn(email, password);
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
            <div className="row">
                <div className="col-md-6 mx-auto">
                    <h2 className="mb-3">Log in</h2>
                    {error && <Alert variant='danger'>{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
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

                        <div className="d-grid gap-2">
                            <Button variant="primary" type="submit">Sign In</Button>
                        </div>
                    </Form>
                    <div className="p-4 box mt-3 text-center">
                        Don't have an account? <Link to="/Register"> Sign Up</Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Login