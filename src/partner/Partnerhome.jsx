import React, { useState, useEffect } from 'react';
import { useUserAuth } from "../context/UserAuthContext";
import { collectionGroup, getDocs, query, deleteDoc, doc, collection } from 'firebase/firestore';
import { Button } from 'react-bootstrap';
import { firestore } from '../database/firebase';
import NavPartner from '../navigation/NavPartner'
import { useNavigate } from 'react-router-dom';
import '../partner/pagecss/Partnerhome.css';
import { Chart } from 'chart.js';
import 'chart.js/auto';

import { FiEye, FiUsers } from "react-icons/fi";
import { FaHotel, FaMountain } from "react-icons/fa";
import { TbPigMoney } from "react-icons/tb";
import { ImConfused } from "react-icons/im";

function Partnerhome() {
    const { logOut, user } = useUserAuth();
    const [profiles, setProfiles] = useState([]);
    const [profilesp, setProfilesp] = useState([]);
    const [profilesps, setProfilesps] = useState([]);
    const [profilesPart, setProfilesPart] = useState([]);
    const navigate = useNavigate();
    const [userProfiles, setUserProfiles] = useState([]);   
    const [userProfilesPart, setUserProfilesPart] = useState([]);
    const [userCommunity, setUserCommunity] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const handleLogout = async () => { 
        try {
            await logOut();
            navigate('/');
        } catch (err) {
            console.log(err.message);
        }
    }

    const fetchProfiles = async () => {
        const arr = [];
    
        const querySnapshot = await getDocs(query(collection(firestore, 'hotels' , user.uid , 'rooms')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
    
                arr.push({ id: doc.id, ...profileData });
            
        });
    
        setProfiles(arr);
        setUserProfiles(arr);
    };

    const fetchProfilesp = async () => {
        const arr = [];
    
        const querySnapshot = await getDocs(query(collection(firestore, 'hotels', user.uid, 'hbookings')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
    
            arr.push({ id: doc.id, ...profileData });
        });
    
        const totalPriceSum = arr.reduce((sum, profile) => sum + (profile.totalPrice || 0), 0);
    
        setProfilesp(arr);
        setTotalPrice(totalPriceSum);
    };

    const fetchProfilesps = async () => {
        const arr = [];
    
        const querySnapshot = await getDocs(query(collection(firestore, 'hotels', user.uid, 'hbookings')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
    
            if (profileData.bookingtype === 'จอง') {
                arr.push({ id: doc.id, ...profileData });
            }
        });
    
        setProfilesps(arr);
        setTotalPrice(totalPriceSum);
    };
    
    

    const fetchProfilesPartner = async () => {
        const arr = [];
    
        const querySnapshot = await getDocs(query(collectionGroup(firestore, 'profiles')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
            if (profileData.usertype === "Partner") {
                arr.push({ id: doc.id, ...profileData });
            }
        });
    
        setProfilesPart(arr);
        setUserProfilesPart(arr);
    };

    const fetchProfilesCommunity = async () => {
        const arr = [];
    
        const querySnapshot = await getDocs(query(collectionGroup(firestore, 'famouss')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
            arr.push({ id: doc.id, ...profileData });
        });
    
        setUserCommunity(arr);
    };

    useEffect(() => {
        fetchProfiles();
        fetchProfilesPartner();
        fetchProfilesCommunity();
        fetchProfilesp();
        fetchProfilesps();
    }, []);

    useEffect(() => {
        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const data = {
            labels: labels,
            datasets: [{
                label: 'My First Dataset',
                data: [50, 30, 40, 60, 80, 90, 70, 55, 65, 75, 85, 95],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(201, 203, 207, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 205, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)',
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                ],
                borderWidth: 1
            }]
        };
        
        const ctx = document.getElementById('myChart2');

        if (Chart.getChart(ctx)) {
            Chart.getChart(ctx).destroy();
        }

        new Chart(ctx, {
            type: 'bar',
            data: data,
        });
    }, []);

    useEffect(() => {
        const chartData = {
            labels: ['จอง', 'เข้าพัก'],
            datasets: [{
                data: [profilesps.length, profilesp.length],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
            }],
        };

        const ctx = document.getElementById('myChart1');

        if (Chart.getChart(ctx)) {
            Chart.getChart(ctx).destroy();
        }

        new Chart(ctx, {
            type: 'pie',
            data: chartData,
        });
    }, [profilesps, profilesp]);

    return (
        <div>
            <NavPartner />
  
            <div className="horizontal-bars-container">
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">จำนวนห้องพัก</p>
                        <h1 className="horizontal-ba-h2">{userProfiles.length}</h1>
                        <FaHotel className="horizontal-ba-icon" />
                    </div>
                </div>
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">จำนวนการจอง</p>
                        <h1 className="horizontal-ba-h2">{profilesps.length}</h1>
                        <ImConfused className="horizontal-ba-icon" />
                    </div>
                </div>
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">จำนวนการเข้าพัก</p>
                        <h1 className="horizontal-ba-h2">{profilesp.length}</h1>
                        <FiUsers className="horizontal-ba-icon" />
                    </div>
                </div>
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">จำนวนเงินทั้งหมด</p>
                        <h1 className="horizontal-ba-h2-p">{totalPrice}</h1>
                        <TbPigMoney className="horizontal-ba-icon" />
                    </div>
                </div>
            </div>

            <div className="horizontal-bars2-container">
                <div className="horizontal-bar2">
                    <div className="horizontal-box2-1">
                        <div style={{ width: '600px', height: '400px', overflow: 'auto' }}>
                            <table>
                                <tbody>
                                    {profiles?.map((profile, i) => (
                                        <tr key={i}>
                                            <td>
                                                <img className="horizontal-box2-img" src={profile.imgUrls} alt="Profile" />
                                            </td>
                                            <td>{profile.type}</td>
                                            <td>{profile.bed}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                    <div className="horizontal-bar2">
                        <div className="horizontal-box2">
                            <canvas id="myChart1" className="horizontal-pin1" ></canvas>
                        </div>
                    </div>
            </div>

        </div>
    );
}

export default Partnerhome;
