import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Nav from '../navigation/Nav'
import Cursor from '../page/manupage/cursor'
import '../pagecss/Home.css';

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

                <div className="body-smoke">
                    <div className="smoke">
                        <span className="smoke-span">T</span>
                        <span className="smoke-span">R</span>
                        <span className="smoke-span">A</span>
                        <span className="smoke-span">V</span>
                        <span className="smoke-span">E</span>
                        <span className="smoke-span">L</span>
                        <span className="smoke-span-a">-</span>
                        <span className="smoke-span">I</span>
                        <span className="smoke-span">N</span>
                        <span className="smoke-span-b">-</span>
                        <span className="smoke-span">K</span>
                        <span className="smoke-span">O</span>
                        <span className="smoke-span">R</span>
                        <span className="smoke-span">A</span>
                        <span className="smoke-span">T</span>
                    </div>
                    
                </div>

                
                <div className="card-title">
                   <div className="card-home-1">
                   <div className="img-title-box">
                        <img  className="img-title" src="https://static.vecteezy.com/system/resources/previews/000/354/613/original/plan-map-vector-icon.jpg" alt="" />
                    </div>
                    <div className="text-title">
                        <h2>สถานที่แนะนำ</h2>
                            <p>
                            สามารถค้นหาข้อมูลสถานที่แนะนำ ไม่ว่าจะเป็นร้านอาหาร คาเฟ่ และสถานที่ท่องเที่ยวต่างๆ ที่อยู่ภายในจังหวัดนครราชสีมา
                            </p>
                    </div>
                   </div>

                   <div className="card-home-1">
                   <div className="img-title-box">
                        <img  className="img-title" src="https://firebasestorage.googleapis.com/v0/b/hotel-001-b5265.appspot.com/o/Imgs%2Fbooking-hotel-vector-37410546.jpg?alt=media&token=9908af24-68bd-4fb6-88a2-e2a9295ba3f5" alt="" />
                    </div>
                    <div className="text-title">
                        <h2>ที่พัก</h2>
                            <p>
                            หากท่านต้องการที่จะเที่ยวและพักผ่อนในจังหวัดนครราชสีมา ก็ยังมีที่พักที่หลากหลายให้ท่านได้เลือกจอง
                            </p>
                    </div>
                   </div>

                   <div className="card-home-1">
                   <div className="img-title-box">
                        <img  className="img-title" src="https://img2.thaipng.com/20180405/dgw/kisspng-bus-computer-icons-clip-art-bus-5ac66872cc4930.6683861215229523068368.jpg" alt="" />
                    </div>
                    <div className="text-title">
                        <h2>รถประจำทาง</h2>
                            <p>
                            มีข้อมูลรถประจำทางบอก สำหรับผู้ที่อยากเดินทางภายในจังหวัดด้วยตัวเองหรือผู้ที่ไม่มีรถส่วนตัว
                            </p>
                    </div>
                   </div>

                   <div className="card-home-1">
                   <div className="img-title-box">
                        <img  className="img-title" src="https://img.favpng.com/1/25/14/partnership-computer-icons-business-partner-png-favpng-t8szH0CJ00qsXe0SSuegkQn9H.jpg" alt="" />
                    </div>
                    <div className="text-title">
                        <h2>พาร์ทเนอร์</h2>
                            <p>
                            สำหรับผู้ที่อยากจะเป็นส่วนหนึ่งกับทางเว็บของเรา สามารถลงทะเบียนที่พักของท่านและร่วมแคมเปญต่างๆได้
                            </p>
                    </div>
                   </div>

                </div>

                <div className="about-card">
                    <div className="about-text">
                    <h2>เกี่ยวกับเรา</h2>
                        <p>
                        เว็บแอพพลิเคชันนี้เป็นส่วนหนึ่งของรายวิชาโครงงานเทคโนโลยีดิจิทัล 2 ซึ่งเป็นเว็บแอพพลิเคชันเกี่ยวกับการส่งเสริมและพัฒนา <br />
                        การท่องเที่ยวในจังหวัดนครราชสีมา สามารถจองห้องพัก ค้นหาสถานที่ท่องเที่ยว ร้านอาหารคาเฟ่ต่างๆ และมีตารางรถให้ดูเพื่อ <br />
                        การตัดสินใจในการเดินทางท่องเที่ยว
                        </p>
                    </div>
                </div>
              
                   


            <Cursor/>
        </div>

                

    )
}

export default Home;