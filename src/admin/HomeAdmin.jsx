import React, { useState, useEffect } from 'react';
import { useUserAuth } from "../context/UserAuthContext";
import { collectionGroup, getDocs, query, doc } from 'firebase/firestore';
import { Button } from 'react-bootstrap';
import { firestore } from '../database/firebase';
import Nav from './NavAdmin';
import { useNavigate } from 'react-router-dom';
import './admincss/HomeAdmin.css';
import { Chart } from 'chart.js';
import 'chart.js/auto';

import { FiEye, FiUsers } from "react-icons/fi";
import { FaHotel, FaMountain } from "react-icons/fa";

function HomeAdmin() {
    const { logOut, user } = useUserAuth();
    const [profiles, setProfiles] = useState([]);
    const [profilesPart, setProfilesPart] = useState([]);
    const navigate = useNavigate();
    const [userProfiles, setUserProfiles] = useState([]);
    const [userProfilesPart, setUserProfilesPart] = useState([]);
    const [userProfilesParts, setUserProfilesParts] = useState([]);
    const [userCommunity, setUserCommunity] = useState([]);
    const [userHotel, setUserHotel] = useState([]);

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

        const querySnapshot = await getDocs(query(collectionGroup(firestore, 'profiles')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
            if (profileData.usertype === "User") {
                arr.push({ id: doc.id, ...profileData });
            }
        });

        setProfiles(arr);
        setUserProfiles(arr);
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

    const fetchProfilesPartners = async () => {
        const arr = [];

        const querySnapshot = await getDocs(query(collectionGroup(firestore, 'hotels')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
            if (profileData.usertype === "Partner") {
                arr.push({ id: doc.id, ...profileData });
            }
        });

        setUserProfilesParts(arr);
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

    const fetchProfilesHotel = async () => {
        const arr = [];

        const querySnapshot = await getDocs(query(collectionGroup(firestore, 'hotels')));
        querySnapshot.forEach((doc) => {
            const profileData = doc.data();
            arr.push(profileData); 
        });

        console.log("Hotel",arr)

        setUserHotel(arr);
    };

    useEffect(() => {
        fetchProfiles();
        fetchProfilesPartner();
        fetchProfilesCommunity();
        fetchProfilesHotel();
        fetchProfilesPartners();
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
            labels: ['Users', 'Partners'],
            datasets: [{
                data: [userProfiles.length, userProfilesParts.length],
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
    }, [userProfiles, userProfilesParts]);

    return (
        <div>
            <Nav />
  
            <div className="horizontal-bars-container">
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">Users</p>
                        <h1 className="horizontal-ba-h2">{userProfiles.length}</h1>
                        <FiEye className="horizontal-ba-icon" />
                    </div>
                </div>
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">Partners</p>
                        <h1 className="horizontal-ba-h2">{userProfilesParts.length}</h1>
                        <FaHotel className="horizontal-ba-icon" />
                    </div>
                </div>
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">Hotel</p>
                        <h1 className="horizontal-ba-h2">{userHotel?.length || 0}</h1>
                        <FiUsers className="horizontal-ba-icon" />
                    </div>
                </div>
                <div className="horizontal-bar">
                    <div className="horizontal-box">
                        <p className="horizontal-ba-p">Famous</p>
                        <h1 className="horizontal-ba-h2">{userCommunity.length}</h1>
                        <FaMountain className="horizontal-ba-icon" />
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
                                                <img className="horizontal-box2-img" src={profile.profile} alt="Profile" />
                                            </td>
                                            <td>{profile.name}</td>
                                            <td>{profile.email}</td>
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

            <div className="horizontal-bars3-container">
                <div className="horizontal-bar3">
                    <canvas id="myChart2" ></canvas>
                </div>
            </div>

        </div>
    );
}

export default HomeAdmin;
