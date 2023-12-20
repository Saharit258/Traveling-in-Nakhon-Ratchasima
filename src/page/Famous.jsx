import React, { useState, useEffect } from 'react';
import Nav from '../navigation/Nav';
import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../database/firebase';
import '../pagecss/Famous.css';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useUserAuth } from '../context/UserAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import 'swiper/css';
import 'swiper/css/navigation';


function Famous() {
  const navigate = useNavigate();
  const { user } = useUserAuth();
  const [dataFromFirestore, setDataFromFirestore] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedadd, setSelectedadd] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true); 

  const fetchDataFromFirestore = async () => {
    try {
      const q = query(collection(firestore, 'famouss'));
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => doc.data());
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

  const filteredData = dataFromFirestore.filter(
    (item) =>
      ((item.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.add?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.style?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (item.type?.toLowerCase() || '').includes(searchTerm.toLowerCase())) &&
      (selectedType === '' || item.type === selectedType || item.style === selectedType)
  );

  const navigateToMap = () => {
    navigate('/Map');
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === dataFromFirestore.length * dataFromFirestore[0]?.imgUrls.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, [currentImageIndex, dataFromFirestore]);

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? dataFromFirestore.length * dataFromFirestore[0]?.imgUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === dataFromFirestore.length * dataFromFirestore[0]?.imgUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageClick = (imageUrl) => {
    setFullImageUrl(imageUrl);
    setShowFullImage(true);
  };

  const closeFullImage = () => {
    setShowFullImage(false);
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
                                value="อำเภอเมืองนครราชสีมา"
                                onChange={handleSearch}
                                
                              />
                              เมืองนครราชสีมา
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอพิมาย"
                              />
                              พิมาย
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอคง"
                              />
                              คง
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอปักธงไชย"
                              />
                              ปักธงไชย
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอโชคชัย"
                              />
                              โชคชัย
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอสีคิ้ว"
                                onChange={handleSearch}
                              />
                              สีคิ้ว
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอโนนสูง"
                              />
                              โนนสูง
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอสูงเนิน"
                              />
                              สูงเนิน
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอบัวใหญ่"
                              />
                              บัวใหญ่
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอด่านขุนทด"
                              />
                              ด่านขุนทด
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอโนนไทย"
                              />
                              โนนไทย
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอครบุรี"
                              />
                              ครบุรี
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอจักรราช"
                              />
                              จักรราช
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอห้วยแถลง"
                              />
                              ห้วยแถลง
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอปากช่อง"
                              />
                              ปากช่อง
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอชุมพวง"
                              />
                              ชุมพวง
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอประทาย"
                              />
                              ประทาย
                            </label>
                          </div>

                          <div>
                            <label>
                              <input
                                type="checkbox"
                                name="restaurantType"
                                value="อำเภอขามทะเลสอ"
                              />
                              ขามทะเลสอ
                            </label>
                          </div>

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
              {isLoading && <p className='loading-famous' ><div class="spinner-border" role="status">
                                    <span class="sr-only"></span>
                                  </div></p>}

              {!isLoading && (

                <div>
                  {filteredData.map((item, index) => (
                    <div key={index} >
                      <div className="box-item-bar">
                        <div className="box-item-bar-img">
                          <button className="popular__card__header_button" onClick={handlePrevImage}>
                            <FontAwesomeIcon icon={faChevronLeft} className='Left-Icon' />
                          </button>
                          <img
                            src={item.imgUrls && item.imgUrls[currentImageIndex % item.imgUrls.length]}
                            alt={`Image ${currentImageIndex + 1}`}
                            className="box-item-bar-img-1"
                            onClick={() => handleImageClick(item.imgUrls[currentImageIndex % item.imgUrls.length])}
                          />
                          <button className="popular__card__header_button" onClick={handleNextImage}>
                            <FontAwesomeIcon icon={faChevronRight} className='Right-Icon' />
                          </button>
                        </div>
                        <div className="box-item-bar-txt">
                        <div className="box-item-bar-txt-1">
                            <p className="box-item-bar-txt-1-p">ชื่อร้าน: <span className="box-item-bar-txt-1-p-p">{item.name}</span></p>
                            <p className="box-item-bar-txt-1-p">รูปแบบ: <span className="box-item-bar-txt-1-p-p">{item.style}</span></p>
                            <p className="box-item-bar-txt-1-p">ที่อยู่: <span className="box-item-bar-txt-1-p-p">{item.add}</span></p>
                          </div>
                          <div className="box-item-bar-txt-1">
                            <p className="box-item-bar-txt-1-p">
                              เวลาเปิดปิด: {' '}
                              <span className={`box-item-bar-txt-1-p-p ${isStoreOpen(item.time, item.closingTime) ? 'open' : 'closed'}`}>
                                {item.time} - {item.closingTime}
                                {isStoreOpen(item.time, item.closingTime) ? ' (เปิดอยู่)' : ' (ปิดแล้ว)'}
                              </span>
                            </p>
                            <p className="box-item-bar-txt-1-p">ราคา: <span className="box-item-bar-txt-1-p-p">{item.price}</span></p>
                            <p className="box-item-bar-txt-1-p">ประเภท: <span className="box-item-bar-txt-1-p-p">{item.type}</span></p>
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

export default Famous;
