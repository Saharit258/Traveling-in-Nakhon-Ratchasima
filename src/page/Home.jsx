import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav'

import { collection, getDocs, doc } from 'firebase/firestore';
import { auth, firestore } from '../database/firebase'
import { onAuthStateChanged } from "firebase/auth";

function Home() {
    const [todos, setTodos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

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

    useEffect(() => {
        // const checkAuthStatus = () => {
        //     if (!user) {
        //         // ถ้ายังไม่ได้เข้าสู่ระบบ
        //         setIsAuthenticated(false);
        //         navigate('/');  // หรือไปที่หน้า login ตามที่คุณต้องการ
        //     } else {
        //         // ถ้าเข้าสู่ระบบแล้ว
        //         setIsAuthenticated(true);
        //         fetchPost();  // เมื่อมีการเข้าสู่ระบบแล้วให้ดึงข้อมูล
        //     }
        // };

        // checkAuthStatus();

        onAuthStateChanged(auth, async(user) => {
            if (user) {
                // has sign in
                setIsAuthenticated(true);
                fetchPost();
                setUser(user);
            } else {
                // has sign out
                setIsAuthenticated(false);
                navigate("/");
            }
        })
    }, [user]);

    return (
        <div>
            <Nav />
            <h2>Welcome to home page</h2>
            {isAuthenticated ? (
                <>
                    <p>Hi, {user?.email}</p>
                    <div>
                        {todos?.map((todo, i) => (
                            <p key={i}>{todo.name}</p>
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
