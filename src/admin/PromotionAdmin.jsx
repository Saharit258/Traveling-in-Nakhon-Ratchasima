import React, { useState, useEffect } from 'react';
import Nav from './NavAdmin';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { collection, collectionGroup, getDocs, query, addDoc } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import { Button as BootstrapButton } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

function Promotion() {
  const { user } = useUserAuth();
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const navigate = useNavigate();

  const fetchProfiles = async () => {
    let arr = [];

    const querySnapshot = await getDocs(query(collectionGroup(firestore, "profiles")));
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    arr = [];
  }

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'promotions'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDataFromFirestore(fetchedData);
      setFilteredData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const coupondata = (id) => {
    alert(id);
  };

  const datasubmit = async (e) => {
    e.preventDefault();
    try {
      const promotionData = {
        about: filteredData[0]?.about,
        discount: filteredData[0]?.discount,
        image: filteredData[0]?.image,
        promotionname: filteredData[0]?.promotionname,
        starttime: filteredData[0]?.starttime,
        endtime: filteredData[0]?.endtime,
        uid: user.uid,
        type: "พร้อมใช้งาน"
      };
      const userBookingCollectionRef = collection(firestore, 'users', user.uid, 'coupon');
      const userBookingDocRef = await addDoc(userBookingCollectionRef, promotionData);
      alert("รับคูปองแล้ว");
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (selectedType === '') {
      setFilteredData(dataFromFirestore);
    } else {
      const filtered = dataFromFirestore.filter((item) => item.promotionname === selectedType);
      setFilteredData(filtered);
    }
  }, [selectedType, dataFromFirestore]);

  useEffect(() => {
    if (searchTerm !== '') {
      const filtered = dataFromFirestore.filter((item) =>
        item.promotionname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(dataFromFirestore);
    }
  }, [searchTerm, dataFromFirestore]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const handleCloseImageModal = () => {
    setSelectedImage('');
    setShowImageModal(false);
  };

  const handleConfirmhotellogadd = () => {
    navigate("/AddpromptionAdmin");
  };

  return (
    <>
      <Nav />

      <div>
        <div className="card-promotion">
          <h2>โปรโมชันและสิทธิพิเศษ</h2>
        </div>

        <div className="box-container-promotion">
          <div className="promotion-sidebar">
            <h2>โปรโมชั่นต่างๆ</h2>

            <div>
              <label>
                <input
                  type="radio"
                  value="มื้อเช้า"
                  checked={selectedType === 'มื้อเช้า'}
                  onChange={() => setSelectedType('มื้อเช้า')}
                />
                เซ็ตอาหารมื้อเช้า
              </label>
            </div>

            <div>
              <label>
                <input
                  type="radio"
                  value="มื้อเย็น"
                  checked={selectedType === 'มื้อเย็น'}
                  onChange={() => setSelectedType('มื้อเย็น')}
                />
                เซ็ตอาหารมื้อเย็น
              </label>
            </div>

            <hr></hr>

            <h2>เพิ่มโปรโมชั่น</h2>

            <div>
              <button className='car-admindd' onClick={handleConfirmhotellogadd}>เพิ่ม</button>
            </div>

          </div>

          <div className="promotion-product">
            {filteredData.map((item, i) => (
              <div className="promotion-item" key={i}>
                <img
                  src={item.image}
                  className="img-promotion"
                  alt={item.promotionname}
                  onClick={() => handleImageClick(item.image)}
                />
                <p>{item.about}</p>
                <BootstrapButton onClick={(e) => datasubmit(e)} className="button-promotion">
                  รับส่วนลด
                </BootstrapButton>
              </div>
            ))}
          </div>
        </div>
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
    </>
  );
}

export default Promotion;
