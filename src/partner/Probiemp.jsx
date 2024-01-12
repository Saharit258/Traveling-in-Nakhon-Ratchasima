import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Modal } from 'react-bootstrap';
import '../partner/pagecss/Bookingpartner.css';
import { useUserAuth } from '../context/UserAuthContext';
import NavPartner from '../navigation/NavPartner';
import { useNavigate } from 'react-router-dom';

function Probiemp() {
    const { user } = useUserAuth();
    const [todos, setTodos] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchPost = async () => {
        const userDocRef = doc(firestore, 'hotels', user.uid);
        const profilesCollectionRef = collection(userDocRef, 'probiemp');
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

    useEffect(() => {
        fetchPost();
    }, [user.uid]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB');
    };

    const handleShowModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setSelectedItem(null);
        setShowModal(false);
    };

    return (
        <>
            <NavPartner />
            <div className="card-Hotel">
                <h2>ข้อความแจ้งเตือน</h2>
            </div>

            <div className="box-container-promotion">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ลำดับ</th>
                            <th>ห้อง</th>
                            <th>ชื่อผู้จอง</th>
                            <th>วันที่ส่ง</th>
                            <th>แสดงข้อมูล</th>
                        </tr>
                    </thead>
                    <tbody>
                        {todos.map((item, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>{item.problemp}</td>
                                <td>{item.problemsusubjectp}</td>
                                <td>{formatDate(item.time)}</td>
                                <td>
                                    <button className='kub-button-3' onClick={() => handleShowModal(item)}>
                                        เพิ่มเติม
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>ข้อมูลเพิ่มเติม</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <>
                            <p>ห้อง: {selectedItem.problemp}</p>
                            <p>ชื่อผู้จอง: {selectedItem.problemsusubjectp}</p>
                            <p>วันที่ส่ง: {formatDate(selectedItem.time)}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button className='kub-button-3' onClick={handleCloseModal}>
                        ปิด
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Probiemp;
