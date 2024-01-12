import React, { useState, useEffect } from 'react';
import Nav from './NavAdmin';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import './admincss/FamousAdmin.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function FamousAdmin() {
  const { user } = useUserAuth();
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState('');

  const navigate = useNavigate();

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'famouss'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDataFromFirestore(fetchedData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  useEffect(() => {
    const defaultDistricts = ["เมืองนครราชสีมา"];
    setSelectedDistricts(defaultDistricts);
  }, []);

  const isStoreOpen = (startTime, closingTime) => {
    if (startTime && closingTime) {
      const currentDate = new Date();
      const currentTime = currentDate.getHours() * 60 + currentDate.getMinutes();

      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [closingHour, closingMinute] = closingTime.split(':').map(Number);

      const storeStartTime = startHour * 60 + startMinute;
      const storeClosingTime = closingHour * 60 + closingMinute;

      return currentTime >= storeStartTime && currentTime <= storeClosingTime;
    }
    return false;
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDistrictCheckboxChange = (event) => {
    const districtValue = event.target.value;
    if (selectedDistricts.includes(districtValue)) {
      setSelectedDistricts((prevSelectedDistricts) =>
        prevSelectedDistricts.filter((district) => district !== districtValue)
      );
    } else {
      setSelectedDistricts((prevSelectedDistricts) => [...prevSelectedDistricts, districtValue]);
    }
  };

  const filteredData = dataFromFirestore.filter(
    (item) =>
      ((item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.add?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.style?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
      (selectedType === '' || item.type === selectedType || item.style === selectedType) &&
      (selectedDistricts.length === 0 || selectedDistricts.includes(item.districts))
  );

  const AddfamousPage = () => {
    navigate('/FamousAdminAdd');
  };

  const navigateToMap = () => {
    navigate('/Map');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === dataFromFirestore.length * dataFromFirestore[0]?.imgUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 15000);

    return () => clearInterval(intervalId);
  }, [currentImageIndex, dataFromFirestore]);

  const handleImageClick = (imageUrl) => {
    setFullImageUrl(imageUrl);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
  };

  const handleAddButtonClick = (id) => {
    console.log('Clicked on Add button for UID:', id);
    navigate(`/Famouspage?uid=${id}`);
  };

  return (
    <>
      <div className="body-fm">
        <Nav />
        <div className="card-Famous">
          <h2>ร้านอาหารและสถานที่แนะนำ</h2>
        </div>

        <div className="box-container-famous">
          <div className="famous-sidebar">
            <div className="Search-famous">
              <div className="search-famous">
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={handleSearch}
                  placeholder="Search"
                />
                <FontAwesomeIcon className='icon-search' icon={faSearch} />
              </div>

              <hr></hr>

              <div>
                <label>
                  <input
                    type="radio"
                    name="restaurantType"
                    value=""
                    checked={selectedType === ''}
                    onChange={() => setSelectedType('')}
                  />
                  ทั้งหมด
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="radio"
                    name="restaurantType"
                    value="คาเฟ่"
                    checked={selectedType === 'คาเฟ่'}
                    onChange={() => setSelectedType('คาเฟ่')}
                  />
                  คาเฟ่
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="radio"
                    name="restaurantType"
                    value="ร้านอาหาร"
                    checked={selectedType === 'ร้านอาหาร'}
                    onChange={() => setSelectedType('ร้านอาหาร')}
                  />
                  ร้านอาหาร
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="radio"
                    name="restaurantType"
                    value="สถานที่เที่ยว"
                    checked={selectedType === 'สถานที่เที่ยว'}
                    onChange={() => setSelectedType('สถานที่เที่ยว')}
                  />
                  สถานที่เที่ยว
                </label>
              </div>

              <hr></hr>

              <h4>อำเภอ</h4>

              <div>
                <label>
                  <input
                    type="checkbox"
                    name="restaurantType"
                    value="เมืองนครราชสีมา"
                    onChange={handleDistrictCheckboxChange}
                    checked={selectedDistricts.includes("เมืองนครราชสีมา")}
                  />
                  เมืองนครราชสีมา
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    name="restaurantType"
                    value="วังน้ำเขียว"
                    onChange={handleDistrictCheckboxChange}
                    checked={selectedDistricts.includes("วังน้ำเขียว")}
                  />
                  วังน้ำเขียว
                </label>
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    name="restaurantType"
                    value="พิมาย"
                    onChange={handleDistrictCheckboxChange}
                    checked={selectedDistricts.includes("พิมาย")}
                  />
                  พิมาย
                </label>
              </div>

              <hr></hr>

              <Button className="famous-button-add" onClick={() => AddfamousPage()}>
                เพิ่มสถานที่
              </Button>

              <hr></hr>
              <h4>ค้นหาจากแผนที่</h4>
              <div className="map-famous">
                <Button className="famous-button-map" onClick={navigateToMap}>
                  ดูแผนที่
                </Button>
              </div>
            </div>
          </div>

          <div className="Famous-product">
            {isLoading && <p className='loading-famous'><div className="spinner-border" role="status"><span className="sr-only"></span></div></p>}

            {!isLoading && (
              <div>
                {filteredData.map((item, index) => (
                  <div key={index} onClick={() => handleAddButtonClick(item.id)}>
                    <div className="box-item-bar">
                      <div className="image-container">
                        {item.imgUrls.map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img}
                            alt=""
                            className="item-image"
                            onClick={() => handleImageClick(img)}
                          />
                        ))}
                      </div>
                      <div className="box-item-bar-txt">
                        <div className="box-item-bar-txt-1">
                          <h1 className="box-item-bar-txt-1-famouss-name">{item.name}</h1>
                          <p className="box-item-bar-txt-1-p">
                            {' '}
                            <span className={`box-item-bar-txt-1-p-p ${isStoreOpen(item.time, item.closingTime) ? 'open' : 'closed'}`}>
                              {item.time} - {item.closingTime}
                              {isStoreOpen(item.time, item.closingTime) ? ' (เปิดอยู่)' : ' (ปิดแล้ว)'}
                            </span>
                          </p>
                          <p className="box-item-bar-txt-1-p">
                            <span className="box-item-bar-txt-1-p-p">{item.add} ตำบล{item.district} อำเภอ{item.districts} {item.codezo}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showFullImage && (
              <div className="full-image-overlay" onClick={closeFullImage}>
                <div className="full-image-container">
                  <img src={fullImageUrl} className="full-image-container-img" alt="Full Size" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FamousAdmin;
