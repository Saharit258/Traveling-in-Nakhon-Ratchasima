import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './NavProfile.css'

import { collection, getDocs, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase';

function NavProfile() {
    const { logOut, user } = useUserAuth();
    const [todos, setTodos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthStatus = async () => {
            if (!user) {
                // ถ้ายังไม่ได้เข้าสู่ระบบ
                setIsAuthenticated(false);
                // หรือไปที่หน้า login ตามที่คุณต้องการ
            } else {
                // ถ้าเข้าสู่ระบบแล้ว
                setIsAuthenticated(true);
                await fetchPost(); // เมื่อมีการเข้าสู่ระบบแล้วให้ดึงข้อมูล
            }
        };

        checkAuthStatus();
    }, [user, navigate]);

    const fetchPost = async () => {
        const userDocRef = doc(firestore, 'users', user.uid);
        const profilesCollectionRef = collection(userDocRef, 'profiles');
        try {
            const querySnapshot = await getDocs(profilesCollectionRef);
            const userProfileData = [];

            querySnapshot.forEach((doc) => {
                userProfileData.push(doc.data());
            });
            setTodos(userProfileData); // กำหนดข้อมูลให้กับ state
        } catch (err) {
            console.error("Error", err);
        }
    }

    const handleProfile = async () => {
        try {
            navigate('/Profile');
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <nav className='menubars'>
            <div className='menubar-logs'>
                {user?.email && (
                    <div className='box-nav-profiles'>
                        {todos.map((todo, i) => (
                            <div className='profile-nav-containers' key={i}>
                                <img src={todo.Profile} className='profile-navs' alt={todo.Name} />
                                <a onClick={handleProfile} className='manu-logs'>{todo.Name}</a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default NavProfile;
