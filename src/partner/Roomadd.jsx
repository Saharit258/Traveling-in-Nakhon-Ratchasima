import React, { useState, useEffect } from "react";
import { useUserAuth } from "../context/UserAuthContext";
import Nav from '../navigation/NavPartner';
import { Link, useNavigate } from 'react-router-dom';
import '../partner/pagecss/Room.css';
import { CiSearch } from "react-icons/ci";
import { collection, getDocs, doc, updateDoc, query, deleteDoc } from 'firebase/firestore';
import { firestore, storage } from '../database/firebase';
import { connectStorageEmulator } from "firebase/storage";
import { Modal, Button } from 'react-bootstrap';

function Roomadd() {
  const { user } = useUserAuth();
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();
  const [userHotel, setUserHotel] = useState();
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProfilesHotel = async () => {
    const q = query(collection(firestore, 'hotels', user.uid, 'rooms'));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    fetchedData.sort((a, b) => a.roomno.localeCompare(b.roomno));
    setUserHotel(fetchedData);
    console.log('Clicked on Add button for UID:', fetchedData);
  };

  useEffect(() => {
    fetchProfilesHotel();
  }, [user.uid]);

  const addRoom = () => {
    navigate('/AddRoom');
  };

  const handleAddButtonClick = (id) => {
    console.log('UID:', id);
    setShowModal(true);
    setSelectedRoom(userHotel.find(room => room.id === id));
  };

  const deleteRoom = async (roomId) => {
    const roomRef = doc(firestore, 'hotels', user.uid, 'rooms', roomId);
    await deleteDoc(roomRef);
    fetchProfilesHotel();
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  return (
    <>
      <Nav />

      <div className='box-Promotion'>
        <button className='room-button-add' onClick={addRoom}>เพิ่มห้องพัก</button>
        <div className="table-card">
          <div className="room-text">ห้องพักทั้งหมด</div>
          <div className='box-Promotion-rox'>
            <table>
              <thead>
                <tr>
                  <th>เลขห้อง</th>
                  <th>ประเภทห้อง</th>
                  <th>จำนวนคน</th>
                  <th>ราคา</th>
                  <th>ดูรายละเอียดที่พัก</th>
                </tr>
              </thead>
              <tbody>
                {userHotel?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.roomno}</td>
                    <td>{item.type}</td>
                    <td>{item.people}</td>
                    <td>{item.price}</td>
                    <td>
                      <button className="room-view-icon" onClick={() => handleAddButtonClick(item.id)}>ดูรายละเอียดห้อง</button>
                      <button className="room-cancle-icon" onClick={() => deleteRoom(item.id)}>ลบห้อง</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>รายละเอียดห้อง</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRoom && (
            <div>
              <p>เลขห้อง: {selectedRoom.roomno}</p>
              <p>ประเภทห้อง: {selectedRoom.type}</p>
              <p>ราคา: {selectedRoom.price}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Roomadd;
