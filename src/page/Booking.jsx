import React, { useState, useEffect } from 'react';
import Nav from '../navigation/Nav';
import { collectionGroup, getDocs, query, collection } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Booking.css';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Booking() {
  const { user } = useUserAuth();
  const navigate = useNavigate();
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [Room, setRoom] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'hotels'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDataFromFirestore(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const fetchProfiles = async () => {
    try {
      const querySnapshot = await getDocs(collectionGroup(firestore, 'rooms'));
      const arr = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRoom(arr);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handlePriceChange = (newPriceRange) => {
    setPriceRange(newPriceRange);
  };

  const handleFacilityChange = (facility) => {
    const updatedFacilities = selectedFacilities.includes(facility)
      ? selectedFacilities.filter((selectedFacility) => selectedFacility !== facility)
      : [...selectedFacilities, facility];
    setSelectedFacilities(updatedFacilities);
  };

  const handleDistrictChange = (district) => {
    const updatedDistricts = selectedDistricts.includes(district)
      ? selectedDistricts.filter((selectedDistrict) => selectedDistrict !== district)
      : [...selectedDistricts, district];
    setSelectedDistricts(updatedDistricts);
  };

  const handleAddButtonClick = (id) => {
    navigate(`/Bookingcard?uid=${id}`);
  };

  const filteredData = dataFromFirestore.filter((item) =>
    item.pname.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <>
      <Nav />
      <div className="search-card-book">
        <div className="line-hotel">
          <p>ชื่อที่พัก/สถานที่</p>
          <input
            type="search"
            id="gsearch"
            className="gsearch-hotel"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="chack-in">
          <p>เช็คอิน</p>
          <input type="date" id="checkInDate" className="check-in-date" />
        </div>
        <div className="chack-out">
          <p>เช็คเอาท์</p>
          <input type="date" id="checkOutDate" className="check-out-date" />
        </div>
        <div className="chack-person">
          <p>ผู้ใหญ่</p>
          <select className="adults" id="adults">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="chack-sun">
          <p>เด็ก</p>
          <select className="children" id="children">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div className="chack-button">
          <button>ตกลง</button>
        </div>
      </div>
  
      <div className="box-container-booking">
        <div className="booking-sidebar">
          <div className="map-famous">
            <Button className="famous-button-map">ดูแผนที่</Button>
          </div>
          <hr />
          <h4>ราคา</h4>
          <div className="price-booking">
            <input
              type="range"
              id="priceRange"
              name="priceRange"
              min="0"
              max="10000"
              value={priceRange.max}
              onChange={(e) =>
                handlePriceChange({ min: 0, max: parseInt(e.target.value, 10) })
              }
            />
            <span>{priceRange.max} บาท</span>
          </div>
          <div className="price-range">
            <label htmlFor="minPrice">ต่ำสุด:</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              className='minPrice-booking'
              value={priceRange.min}
              onChange={(e) =>
                handlePriceChange({ min: parseInt(e.target.value, 10), max: priceRange.max })
              }
            />
            <label htmlFor="maxPrice"> --- สูงสุด:</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              className='minPrice-booking'
              value={priceRange.max}
              onChange={(e) =>
                handlePriceChange({ min: priceRange.min, max: parseInt(e.target.value, 10) })
              }
            />
          </div>
          <hr />
          <h4>สิ่งอำนวยความสะดวก</h4>
          <div className="facility-booking-checkbox">
            {['สปา', 'ร้านอาหาร', 'อาหารเช้า', 'ขี่ม้า'].map((facility, index) => (
              <div key={index} className="facility-checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="facilityType"
                    value={facility}
                    checked={selectedFacilities.includes(facility)}
                    onChange={() => handleFacilityChange(facility)}
                  />
                  {facility}
                </label>
              </div>
            ))}
          </div>
  
          <hr />
          <h4>อำเภอ</h4>
          <div>
            {['เมืองนครราชสีมา', 'วังน้ำเขียว'].map((district, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    name="districtType"
                    value={district}
                    checked={selectedDistricts.includes(district)}
                    onChange={() => handleDistrictChange(district)}
                  />
                  {district}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="booking-product">
          {filteredData
            .filter(
              (item) =>
                Room.some(
                  (room) =>
                    room.ruid === item.id &&
                    room.price >= priceRange.min &&
                    room.price <= priceRange.max &&
                    (selectedDistricts.length === 0 || selectedDistricts.includes(item.amper)) &&
                    (selectedFacilities.length === 0 ||
                      selectedFacilities.every((facility) => item.facility.includes(facility)))
                )
            )
            .map((item, i) => (
              <div key={i} className="card-booking" onClick={() => handleAddButtonClick(item.id)}>
                <div className="img-booking">
                  <img src={item.imgUrls} className="item-image-booking" alt="" />
                </div>
                <div className="text-card-booking">
                  <h2>{item.pname}</h2>
                  <p>ที่พักนี้มีบริการ:</p>
                  <div className="facility-booking">
                    {item.facility &&
                      item.facility.map((facility, index) => (
                        <div key={index} className="ft-card">
                          {facility}
                        </div>
                      ))}
                  </div>
                  <p>สถานที่:</p>
                  <p className="add-booking">
                    {item.address} {item.tambol} อำเภอ{item.amper} นครราชสีมา {item.zipcode}
                  </p>
                </div>
                <div className="text-card2-booking">
                  <h2 className="text-booking-pi-min">
                    ฿{' '}
                    {Math.min(
                      ...Room.filter((room) => room.ruid === item.id).map((room) => room.price)
                    )}
                  </h2>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Booking;
