import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from "../../context/UserAuthContext";
import { collection, getDoc, doc, query, getDocs } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import '../../pagecss/Bookingcard.css';
import { Modal, Button } from 'react-bootstrap';

function Bookingcard() {
  const { logOut, user } = useUserAuth();
  const uid = new URLSearchParams(useLocation().search).get('uid');
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [roomHotel, setRoomHotel] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProfilesHotel = async () => {
    const q = query(collection(firestore, 'hotels', uid, 'rooms'));
    const querySnapshot = await getDocs(q);
    const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    fetchedData.sort((a, b) => a.roomno.localeCompare(b.roomno));
    setRoomHotel(fetchedData);
    console.log('check room:', fetchedData);
  };

  useEffect(() => {
    fetchProfilesHotel();
  }, [user.uid]);


  const fetchPost = async () => {
    try {
      const docRef = doc(firestore, 'hotels', uid, );
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const fetchedData = { id: docSnap.id, ...docSnap.data() };
        setDataFromFirestore([fetchedData]);
        
      } else {
        console.log('Document not found.', uid);
        setDataFromFirestore([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  

  useEffect(() => {
    fetchPost();
  }, []);

  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <>
      <Nav />
      <div className='roombox'>
        <h4>ห้องว่าง</h4>
        <div className='roomcard'>
          <div className='roomsome'>
            <table>
              <thead className="roomtable">
                <tr>
                  <th>เลขห้อง</th>
                  <th>ประเภทห้อง</th>
                  <th>จำนวนผู้เข้าพัก</th>
                  <th>ราคา</th>
                  <th>สิ่งอำนวยความสะดวก</th>
                  <th>สถานะ</th>
                  <th>จองห้องพัก</th>
                </tr>
              </thead>
              <tbody>
                {roomHotel?.map((item, i) => (
                  <tr key={i}>
                    <td>{item.roomno}</td>
                    <td>{item.type}</td>
                    <td>{item.people}</td>
                    <td>{item.price}</td>
                    <td>
                      {item.roomfacility &&
                        item.roomfacility.map((facility, index) => (
                          <div key={index} className="roomfacility">
                            {facility}
                          </div>
                        ))}
                    </td>
                    <td>{item.roomstatus}</td>
                    <td>
                      <Button className='booking-btn' onClick={handleModalOpen}>
                        จองห้องพัก
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>หัวข้อโมดัล</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ข้อมูลภายในโมดัล
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            ปิด
          </Button>
          {/* Additional modal action buttons */}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Bookingcard;
