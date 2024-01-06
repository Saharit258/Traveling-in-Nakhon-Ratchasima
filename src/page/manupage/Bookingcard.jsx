import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from "../../context/UserAuthContext";
import { collection, getDoc, doc, query, getDocs } from 'firebase/firestore';
import { firestore } from '../../database/firebase';
import Nav from '../../navigation/Nav';
import '../../pagecss/Bookingcard.css';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Bookingcard() {
  const { logOut, user } = useUserAuth();
  const navigate = useNavigate();
  const uid = new URLSearchParams(useLocation().search).get('uid');
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [roomHotel, setRoomHotel] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState({});  

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
      const docRef = doc(firestore, 'hotels', uid);
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

  const handleOpenModal = (item) => {
    setSelectedProblem({
      email: item.roomno,
      type: item.type,
      imgUrls: item.imgUrls,
    });
  };

  const handleCloseModal = () => {
    setSelectedProblem({});
  };

  const handleAddButtonClick = (id) => {
    navigate(`/Bookingroomcard?uid=${id}`);
  };

  return (
    <>
      <Nav />

      {dataFromFirestore.map((item, i) => (
          <div key={i}>
            <div className="image-container-fpage">
              {item.imgUrls && item.imgUrls.length > 0 && (
                item.imgUrls.map((img, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={img}
                    alt=""
                    className="item-image-fpage"
                    onClick={() => handleImageClick(img)}
                  />
                ))
              )}
            </div>
            <div className="card-bookingcard">
              <div className="bookingcard-sidebar">
                <h2 className='box-fpage-left-1'>{item.pname}</h2>
                <p>{item.detail}</p>
              </div>
              <div className="bookingcard-product">
              <h4>สิ่งอำนวยความสะดวก</h4>
                {item.facility && item.facility.length > 0 && (
                  <ul>
                    {item.facility.map((facility, index) => (
                      <li key={index}>{facility}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        ))}

      <div className='roombox'>
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
                    <td className='roomno-booking' onClick={() => handleOpenModal(item)}>{item.roomno}</td>
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
                      <Button className='booking-btn' onClick={() => handleAddButtonClick(item.id)}>
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

      <Modal show={Object.keys(selectedProblem).length > 0} onHide={handleCloseModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton><h3>{selectedProblem.email}</h3></Modal.Header>
        <Modal.Body>
            {selectedProblem && selectedProblem.imgUrls && selectedProblem.imgUrls.length > 0 && (
              <div>
                <div className="image-container-fpage">
                  {selectedProblem.imgUrls.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt=""
                      className="img-booking-modal"
                      onClick={() => handleImageClick(img)}
                    />
                  ))}
                </div>
                <p>{selectedProblem.type}</p>
              </div>
            )}
          </Modal.Body>
        <Modal.Footer>
          <button className='tr-out-booking' onClick={handleCloseModal}>ยกเลิก</button>
        </Modal.Footer>
      </Modal>

    </>
  );
}

export default Bookingcard;
