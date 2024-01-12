import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/Nav';
import '../pagecss/Mycoupon.css';
import Swal from 'sweetalert2';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { collection, getDocs, doc, updateDoc, query, collectionGroup } from 'firebase/firestore';
import { firestore, storage } from '../database/firebase';

function Mycoupon() {
    const { logOut, user } = useUserAuth();
    const [todos, setTodos] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [coupon, setCoupon] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const navigate = useNavigate();

    const Logout = async () => {
        try {
            await logOut();
            Swal.fire({
              icon: 'success',
              title: 'ออกจากระบบ',
              showConfirmButton: false,
            })  
            navigate('/');
        } catch (err) {
          console.log(err.message);
        }
    };

    useEffect(() => {
        const checkAuthStatus = () => {
            if (!user) {
                setIsAuthenticated(false);
                navigate('/');  
            } else {
                setIsAuthenticated(true);
                fetchPost();  
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
            setTodos(userProfileData);  
        } catch (err) {
            console.error("Error", err);
        }
    };

    const getcoupon = async () => {
        try {
            const q = query(collection(firestore, 'users', user.uid, 'coupon'));
            const querySnapshot = await getDocs(q);
            const fetchedData = querySnapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .filter((coupon) => coupon.type === 'พร้อมใช้งาน');
            setCoupon(fetchedData);
        } catch (err) {
            console.error("Error", err);
        }
    };

    useEffect(() => {
        getcoupon();
    }, []);

    const coupondata = (id) => {
        navigate(`/Usecoupon?uid=${id}`);
    };

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setShowImageModal(true);
    };

    const handleCloseImageModal = () => {
        setSelectedImage('');
        setShowImageModal(false);
    };

    return (
        <>
            <Nav />
            <div className="box-container-Coupon">
                <div className="Coupon-sidebar">
                    <div className='profile-card-manu'>
                        <img src={todos[0]?.profile} className='profile-img-manu' alt='Profile' />
                        <p className='profile-name-profile-card-manu'>{todos[0]?.name}</p>
                        <hr></hr>
                        <Link className='manu-manu' to='/Profile'>บัญชีของฉัน</Link>
                        <Link className='manu-manu' to='/Mycoupon'>คูปองของฉัน</Link>
                        <Link className='manu-manu' to='/Reportproblem'>แจ้งปัญหา</Link>
                        <hr></hr>
                        <button onClick={Logout}>ออกจากระบบ</button>
                    </div>
                </div>

                <div className='coupon-card'>
                    {coupon.map((item, i) => (
                        <div className="coupon-item" key={i}>
                            <div className="coupon-img">
                                <img
                                    src={item.image}
                                    className="img-coupon"
                                    alt=""
                                    onClick={() => handleImageClick(item.image)}
                                />
                            </div>
                            <div className="coupon-button">
                                <button className='button-coupon-oo' onClick={() => coupondata(item.id)}>ใช้ส่วนลด</button>
                            </div>
                        </div>
                    ))}
                </div>
                <Modal show={showImageModal} onHide={handleCloseImageModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>รูปภาพ</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <img src={selectedImage} alt="Full-size" style={{ width: '100%' }} />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseImageModal}>
                            ปิด
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
}

export default Mycoupon;
