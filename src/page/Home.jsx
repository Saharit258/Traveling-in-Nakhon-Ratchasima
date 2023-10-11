import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav'

import { collection, getDocs, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase'

function Home() {
    const { logOut, user } = useUserAuth();
    const [todos, setTodos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = () => {
            if (!user) {
                // ถ้ายังไม่ได้เข้าสู่ระบบ
                setIsAuthenticated(false);
                navigate('/');  // หรือไปที่หน้า login ตามที่คุณต้องการ
            } else {
                // ถ้าเข้าสู่ระบบแล้ว
                setIsAuthenticated(true);
                fetchPost();  // เมื่อมีการเข้าสู่ระบบแล้วให้ดึงข้อมูล
            }
        };

        checkAuthStatus();
    }, [user, navigate]);

    const handleLogout = async () => { 
        try {
            await logOut();
            navigate('/');
        } catch (err) {
            console.log(err.message);
        }
    }

    const fetchPost = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const profilesCollectionRef = collection(userDocRef, 'profiles');
        try {
            const querySnapshot = await getDocs(profilesCollectionRef);
            const userProfileData = [];

            querySnapshot.forEach((doc) => {
                userProfileData.push(doc.data());
            });
            setTodos(userProfileData);  // กำหนดข้อมูลให้กับ state
        } catch (err) {
            console.error("Error", err);
        }
    }

    return (
        <div>
            <Nav />
            <h2>Welcome to home page</h2>
            {isAuthenticated ? (
                <>
                    <p>Hi, {user?.email}</p>
                    <div>
                        {todos?.map((todo, i) => (
                            <p key={i}>{todo.Name}</p>
                        ))}
                    </div>
                </>
            ) : (
                <p>Please log in to access this page</p>
            )}
        </div>
    )
}

export default Home;
